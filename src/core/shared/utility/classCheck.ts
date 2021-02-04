export default function isFunction(funcOrClass: ClassDecorator | Function) {
    const propertyNames = Object.getOwnPropertyNames(funcOrClass);
    return !propertyNames.includes('prototype') || propertyNames.includes('arguments');
}
