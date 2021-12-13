import { module } from './module'
import ExNativeFunction from '../util/ExNativeFunction'

export function createNativeFunction<RetType extends NativeFunctionReturnType, ArgTypes extends NativeFunctionArgumentType[] | []>(
  name: string,
  retType: RetType,
  argTypes: ArgTypes,
  abiOrOptions: NativeFunctionOptions | NativeABI = 'default'
): ExNativeFunction<RetType, ArgTypes> {
  const address = Module.findExportByName(module.name, name)

  if (!address) {
    console.warn('Warning! Native mono export not found! Expected export: ' + name)
    return (() => {
      throw new Error('Native mono function not found! (' + name + ')')
    }) as undefined as ExNativeFunction<RetType, ArgTypes>
  }

  return new ExNativeFunction(address, retType, argTypes, abiOrOptions)
}
