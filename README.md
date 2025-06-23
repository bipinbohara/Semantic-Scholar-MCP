
## Semantic Scholar MCP Server

A Model Context Protocol (MCP) server that provides AI models with comprehensive access to the Semantic Scholar Academic Graph API. This server enables intelligent literature search, paper analysis, and citation network exploration through a robust set of tools, resources, and prompts.

Step 1:
## Clone repo and build
```
git clone https://github.com/bipinbohara/Semantic-Scholar-MCP.git
cd AIRA-SemanticScholar
npm ci
npm install
npm run build   
```

###
```
mcpo  --port 8086 --host 192.168.0.2 -- node build/index.js
```


### Test:
```
curl -X 'POST' \
  'http://localhost:8086/papers-search-basic' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "query": "cancer",
  "limit": 10
}'
```
