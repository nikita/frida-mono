/**
 * This is just to make it convinient to use NativeFunctions.
 * Otherwise we would have to store the informations somewhere else.
 * This way its attached to the NativeFunction. Awesome!
 */

class ExNativeFunction<RetType extends NativeFunctionReturnType, ArgTypes extends NativeFunctionArgumentType[] | []> extends NativeFunction<RetType, ArgTypes> {
  public address: NativePointerValue
  public retType: RetType
  public argTypes: ArgTypes
  public abi: NativeABI = 'default'
  public options: NativeFunctionOptions

  constructor(address: NativePointerValue, retType: RetType, argTypes: ArgTypes, abiOrOptions?: NativeABI | NativeFunctionOptions) {
    super(address, retType, argTypes, abiOrOptions)

    this.address = address
    this.retType = retType
    this.argTypes = argTypes

    if (typeof abiOrOptions === 'string') {
      this.abi = abiOrOptions
    } else if (typeof abiOrOptions === 'object') {
      this.abi = abiOrOptions.abi || 'default'
      this.options = abiOrOptions
    }
  }

  nativeCallback<RetType extends NativeCallbackReturnType, ArgTypes extends NativeCallbackArgumentType[] | []>(
    callback: NativeCallbackImplementation<GetNativeCallbackReturnValue<RetType>, Extract<GetNativeCallbackArgumentValue<ArgTypes>, unknown[]>>
  ) {
    return new NativeCallback(callback, this.retType as unknown as RetType, this.argTypes as unknown as ArgTypes, this.abi)
  }

  intercept(callbacksOrProbe: ScriptInvocationListenerCallbacks | NativeInvocationListenerCallbacks | InstructionProbeCallback, data?: NativePointerValue): InvocationListener {
    return Interceptor.attach(this.address, callbacksOrProbe, data)
  }

  replace(replacement: NativePointerValue, data?: NativePointerValue): void {
    return Interceptor.replace(this.address, replacement, data)
  }

  toString(): string {
    return `ExNativeFunction[address=${this.address}, retType=${this.retType}, argTypes=[${this.argTypes}], abi=${this.abi}]`
  }
}

export default ExNativeFunction
