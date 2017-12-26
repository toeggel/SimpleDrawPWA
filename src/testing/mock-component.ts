import { Component, EventEmitter, forwardRef, Input, Output, Type } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

declare var Reflect: any;

export function MockComponent<TComponent>(component: Type<TComponent>): Type<TComponent> {
  const propertyMetadata = getPropertyMetadata(component);

  const options = {
    inputs: new Array<string>(),
    outputs: new Array<string>(),
    providers: [{
      multi: true,
      provide: NG_VALUE_ACCESSOR,
      /* tslint:disable:no-use-before-declare */
      useExisting: forwardRef(() => ComponentMock)
      /* tslint:enable:no-use-before-declare */

    }],
    selector: getComponentSelector(component),
    template: '<ng-content></ng-content>'
  };

  options.inputs = Object.keys(propertyMetadata).filter((meta) => isInput(propertyMetadata[meta]));
  options.outputs = Object.keys(propertyMetadata).filter((meta) => isOutput(propertyMetadata[meta]));

  class ComponentMock implements ControlValueAccessor {
    constructor() {
      options.outputs.forEach((output) => {
        (this as any)[output] = new EventEmitter<any>();
      });
    }

    registerOnChange = (fn: (value: any) => void) => { };
    registerOnTouched = (fn: (value: any) => void) => { };
    writeValue = (value: any) => { };
  }

  return Component(options as Component)(<any>ComponentMock as Type<TComponent>);
}

function isInput(propertyMetadata: any): boolean {
  return propertyMetadata[0].type === Input || propertyMetadata[0].toString() === '@Input';
}

function isOutput(propertyMetadata: any): boolean {
  return propertyMetadata[0].type === Output || propertyMetadata[0].toString() === '@Output';
}

function getComponentSelector(component: any): string {
  if (component.__annotations__) {
    return component.__annotations__[0].selector;
  }
  if (component.decorators) {
    return component.decorators[0].args[0].selector;
  }
  if (Reflect.hasMetadata('annotations', component)) {
    const metadata = Reflect.getMetadata('annotations', component);
    return metadata[0].selector;
  }
  throw new Error('No annotation or decoration metadata on your component');
}

function getPropertyMetadata(component: any): any {
  if (component.propDecorators) {
    return component.propDecorators;
  }
  if (Reflect.hasMetadata('propMetadata', component)) {
    return Reflect.getMetadata('propMetadata', component);
  }
  return {};
}
