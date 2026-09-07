const fs = require('fs')
const path = require('path')

const featureServiceBase =
  'https://services1.arcgis.com/99lidPhWCzftIe9K/ArcGIS/rest/services/LicensedHealthCareFacilities/FeatureServer/0/query'

const rawOutputPath = path.join(__dirname, '..', 'data', 'utah-facilities.raw.json')
const providersOutputPath = path.join(__dirname, '..', 'data', 'utah-providers.scraped.json')

function getAttr(attrs, keys) {
  for (const key of keys) {
    if (attrs[key] !== undefined && attrs[key] !== null && String(attrs[key]).trim() !== '') {
      return attrs[key]
    }
  }
  return undefined
}

function toNumber(value) {
  if (value === undefined || value === null || value === '') return undefined
  const n = Number(value)
  return Number.isNaN(n) ? undefined : n
}

function normalizeFeature(feature) {
  const attrs = feature.attributes || {}
  const geometry = feature.geometry || {}

  const name = getAttr(attrs, [
    'FACILITY_NAME',
    'NAME',
    'BUSINESS_NAME',
    'ORG_NAME',
    'PROVIDER_NAME',
    'ENTITY_NAME',
  ])

  const address = getAttr(attrs, ['ADDRESS', 'ADDRESS1', 'ADDR1', 'STREET', 'FACILITY_ADDRESS'])
  const city = getAttr(attrs, ['CITY', 'CITY_NAME', 'TOWN'])
  const state = getAttr(attrs, ['STATE', 'ST']) || 'UT'
  const zip = getAttr(attrs, ['ZIP', 'ZIPCODE', 'ZIP_CODE'])

  const latitude = toNumber(getAttr(attrs, ['LATITUDE', 'LAT'])) ?? toNumber(geometry.y)
  const longitude = toNumber(getAttr(attrs, ['LONGITUDE', 'LON', 'LONG'])) ?? toNumber(geometry.x)

  const id = toNumber(getAttr(attrs, ['OBJECTID', 'ID', 'FACILITY_ID'])) || toNumber(geometry.objectId)

  return {
    id,
    name: name || 'Unknown Facility',
    location: {
      address: address || '',
      city: city || '',
      state,
      zip: zip || '',
      latitude,
      longitude,
    },
    rating: undefined,
    inNetwork: undefined,
    acceptedPlans: [],
    services: [],
    prices: {
      insuredPrice: undefined,
      cashPrice: undefined,
      currency: 'USD',
    },
    waitTimeMin: undefined,
  }
}

async function fetchAllFeatures() {
  const allFeatures = []
  let resultOffset = 0
  const resultRecordCount = 2000

  while (true) {
    const url =
      `${featureServiceBase}?where=1%3D1&outFields=*` +
      `&f=json&resultOffset=${resultOffset}&resultRecordCount=${resultRecordCount}`

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`)
    }
    const data = await response.json()
    const features = data.features || []
    allFeatures.push(...features)

    if (!data.exceededTransferLimit || features.length === 0) {
      break
    }
    resultOffset += resultRecordCount
  }

  return allFeatures
}

async function main() {
  const features = await fetchAllFeatures()
  fs.writeFileSync(rawOutputPath, JSON.stringify(features, null, 2) + '\n', 'utf8')

  const providers = features.map(normalizeFeature).filter(p => p.name)
  fs.writeFileSync(providersOutputPath, JSON.stringify(providers, null, 2) + '\n', 'utf8')

  console.log(`Fetched ${features.length} facilities`)
  console.log(`Wrote raw data to ${rawOutputPath}`)
  console.log(`Wrote normalized providers to ${providersOutputPath}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
