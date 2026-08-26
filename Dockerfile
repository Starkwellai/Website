# Single-image deploy: FastAPI serves both the API and the built frontend on
# one port, so the whole demo is one container on one small VPS. See
# api/serving_api.py's RewritePrefix middleware and SPA fallback route.

FROM node:20-slim AS frontend
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY index.html vite.config.ts postcss.config.mjs ./
COPY src ./src
COPY public ./public
RUN npm run build

FROM python:3.12-slim
WORKDIR /app
COPY api/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
COPY api/serving_api.py ./serving_api.py
COPY --from=frontend /app/dist ./dist
# The parquet data the API reads. Staged into ./deploy/data first by
# deploy/package_data.ps1 — see DEPLOY.md.
COPY deploy/data ./data

ENV STARKWELL_SLICE=/app/data/serving/service_provider_prices.parquet \
    STARKWELL_CASH=/app/data/serving/cash_by_service.parquet \
    STARKWELL_FACILITIES=/app/data/reference/facility_dim.parquet \
    STARKWELL_FACILITY_MEASURES=/app/data/reference/facility_measures.parquet \
    STARKWELL_HOSPITAL_XW=/app/data/reference/hospital_dim.parquet \
    STARKWELL_PLAN_DESIGN=/app/data/reference/plan_design.parquet \
    STARKWELL_PLAN_BENEFITS=/app/data/reference/plan_benefits.parquet \
    STARKWELL_PLAN_NETWORK=/app/data/reference/plan_network.parquet \
    STARKWELL_CATALOG=/app/data/reference/shoppable_services.parquet \
    STARKWELL_NETWORK_RATES=/app/data/reference/network_rates.parquet \
    STARKWELL_PROVIDERS=/app/data/providers.parquet \
    STARKWELL_TAXONOMY=/app/data/reference/nucc_taxonomy_251.csv \
    STARKWELL_DIST=/app/dist \
    STARKWELL_HOST=0.0.0.0 \
    STARKWELL_PORT=8080

EXPOSE 8080
CMD ["python", "serving_api.py"]
