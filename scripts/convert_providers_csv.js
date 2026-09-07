const fs = require('fs')
const path = require('path')

const inputPath = path.join(__dirname, '..', 'data', 'utah-providers.csv')
const outputPath = path.join(__dirname, '..', 'data', 'utah-providers.json')

function parseCsv(text) {
  const rows = []
  let current = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i]
    const next = text[i + 1]

    if (char === '"') {
      if (inQuotes && next === '"') {
        field += '"'
        i += 1
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (!inQuotes && (char === ',' || char === '\n' || char === '\r')) {
      if (char === '\r' && next === '\n') {
        i += 1
      }
      current.push(field)
      field = ''
      if (char !== ',') {
        rows.push(current)
        current = []
      }
      continue
    }

    field += char
  }

  if (field.length > 0 || current.length > 0) {
    current.push(field)
    rows.push(current)
  }

  return rows.filter(row => row.some(cell => cell.trim().length > 0))
}

function parseServices(raw) {
  if (!raw) return []
  return raw.split(';').map(entry => {
    const [codeType, code, name] = entry.split(':')
    return {
      codeType: (codeType || 'OTHER').trim(),
      code: (code || '').trim(),
      name: (name || '').trim(),
    }
  }).filter(item => item.code || item.name)
}

function parsePlans(raw) {
  if (!raw) return []
  return raw.split(';').map(item => item.trim()).filter(Boolean)
}

function toNumber(value) {
  if (value === undefined || value === null || value === '') return undefined
  const n = Number(value)
  return Number.isNaN(n) ? undefined : n
}

function toBoolean(value) {
  if (!value) return undefined
  return String(value).trim().toLowerCase() === 'true'
}

function normalizeRow(row, headers) {
  const record = {}
  headers.forEach((key, idx) => {
    record[key] = row[idx] !== undefined ? row[idx].trim() : ''
  })

  return {
    id: toNumber(record.id),
    name: record.name,
    location: {
      address: record.address,
      city: record.city,
      state: record.state,
      zip: record.zip,
      latitude: toNumber(record.latitude),
      longitude: toNumber(record.longitude),
    },
    rating: toNumber(record.rating),
    inNetwork: toBoolean(record.inNetwork),
    acceptedPlans: parsePlans(record.acceptedPlans),
    services: parseServices(record.services),
    prices: {
      insuredPrice: toNumber(record.insuredPrice),
      cashPrice: toNumber(record.cashPrice),
      currency: record.currency || 'USD',
    },
    waitTimeMin: toNumber(record.waitTimeMin),
  }
}

function main() {
  if (!fs.existsSync(inputPath)) {
    console.error(`CSV not found: ${inputPath}`)
    process.exit(1)
  }

  const csvText = fs.readFileSync(inputPath, 'utf8')
  const rows = parseCsv(csvText)
  if (rows.length < 2) {
    console.error('CSV must include a header row and at least one data row.')
    process.exit(1)
  }

  const headers = rows[0].map(h => h.trim())
  const dataRows = rows.slice(1)

  const providers = dataRows.map(row => normalizeRow(row, headers))
    .filter(p => p.name && p.location && p.location.city)

  fs.writeFileSync(outputPath, JSON.stringify(providers, null, 2) + '\n', 'utf8')
  console.log(`Wrote ${providers.length} providers to ${outputPath}`)
}

main()
