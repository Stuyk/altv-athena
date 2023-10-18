import { ClothingComponent, DefaultItemBehavior, Item } from '@AthenaShared/interfaces/item.js';

/**
 *
 */
export type ClothingInfo = { sex: number; components: Array<ClothingComponent> };

/**
 * Converts clothing information to an icon name that can be used
 * componentIdentifier-dlcHash-isProp?-isNotShared?-drawableID
 *
 *
 * @param {Item<DefaultItemBehavior, ClothingInfo>} item
 * @return {string}
 */
export function clothingItemToIconName(item: Item<DefaultItemBehavior, ClothingInfo>): string {
    // componentIdentifier-dlcHash-isProp?-isMaleOrFemale?-drawableID
    const component = item.data.components[0];
    let iconName = `${component.id}-${component.dlc}-`;

    if (component.isProp) {
        iconName += 'prop-';
    }

    const isModelLocked = (!component.isProp && component.id === 1) || (!component.isProp && component.id === 5);
    if (!isModelLocked) {
        iconName += item.data.sex === 1 ? 'male-' : 'female-';
    }

    iconName += component.drawable;
    iconName += `.png`;
    return iconName;
}

/**
 * Converts a clothing component to the corresponding icon name that should be used.
 *
 *
 * @param {number} sex
 * @param {Array<ClothingComponent>} components
 * @return {void}
 */
export function clothingComponentToIconName(sex: number, components: Array<ClothingComponent>) {
    const component = components[0];
    let iconName = `${component.id}-${component.dlc}-`;

    if (component.isProp) {
        iconName += 'prop-';
    }

    const isModelLocked = (!component.isProp && component.id === 1) || (!component.isProp && component.id === 5);
    if (!isModelLocked) {
        iconName += sex === 1 ? 'male-' : 'female-';
    }

    iconName += component.drawable;
    iconName += `.png`;
    return iconName;
}
