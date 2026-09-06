with open('components/AdminLayout.tsx', 'r') as f:
    content = f.read()

content = content.replace("import React, { useState } from 'react';", "import React, { useState, useEffect } from 'react';")

with open('components/AdminLayout.tsx', 'w') as f:
    f.write(content)
