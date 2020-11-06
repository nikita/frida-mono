import module from './module'
import ExNativeFunction from '../util/ExNativeFunction'

export function createNativeFunction(name: string, retType: NativeType, argTypes: NativeType[], abiOrOptions: NativeFunctionOptions | NativeABI = 'default'): ExNativeFunction {
  const address = Module.findExportByName(module.name, name)

  if (!address) {
    const error = 'Native mono export not found! Expected export: ' + name
    console.warn(error)
    return (() => { throw new Error(error) }) as undefined as ExNativeFunction
  }

  return new ExNativeFunction(address, retType, argTypes, abiOrOptions)
}