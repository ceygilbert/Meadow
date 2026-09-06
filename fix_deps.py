import json
with open('package.json', 'r') as f:
    data = json.load(f)

data['dependencies']['react-is'] = "^19.0.0"
data['devDependencies']['esbuild'] = "^0.27.0"

with open('package.json', 'w') as f:
    json.dump(data, f, indent=2)
