// Mock API stubs to avoid import errors. Replace with real implementations later.
export async function editPlant(payload: any): Promise<any> {
  console.log('[mock] editPlant', payload)
  return Promise.resolve({ code: 0, data: null })
}

export async function getPlantFactoryInfo(params: any): Promise<any> {
  console.log('[mock] getPlantFactoryInfo', params)
  return Promise.resolve({ code: 0, data: [] })
}

export async function getPlantInsidersInfo(params: any): Promise<any> {
  console.log('[mock] getPlantInsidersInfo', params)
  return Promise.resolve({ code: 0, data: [] })
}

export async function getPlantPlanInfo(params: any): Promise<any> {
  console.log('[mock] getPlantPlanInfo', params)
  return Promise.resolve({ code: 0, data: [] })
}

export async function getPlantVulnerableInfo(params: any): Promise<any> {
  console.log('[mock] getPlantVulnerableInfo', params)
  return Promise.resolve({ code: 0, data: [] })
}

export async function addInsiders(payload: any): Promise<any> {
  console.log('[mock] addInsiders', payload)
  return Promise.resolve({ code: 0, data: null })
}