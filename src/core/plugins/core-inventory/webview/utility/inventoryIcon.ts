import { Item } from '../../../../shared/interfaces/inventory';
import { ClothingComponent } from '../../../../shared/interfaces/clothing';
import ResolvePath from '../../../../../../src-webviews/src/utility/pathResolver';

export function getImagePath(item: Item<Partial<ClothingComponent>>): string {
    const data = item.data;

    // Set Default Image
    if (!data || !data.ids || typeof data.ids[0] !== 'number') {
        return ResolvePath(item.icon.includes('.png') ? item.icon : item.icon + '.png');
    }

    if (!data.drawables) {
        return ResolvePath(item.icon.includes('.png') ? item.icon : item.icon + '.png');
    }

    item = item as Item<ClothingComponent>;

    // componentIdentifier-dlcHash-isProp?-isNotShared?-drawableID
    // Determine Image Set
    const isShared = (!data.isProp && data.ids[0] === 1) || (!data.isProp && data.ids[0] === 5);

    let fileName = `../../assets/images/clothing/${data.ids[0]}-`;

    if (data.dlcHashes && data.dlcHashes[0]) {
        fileName += `${data.dlcHashes[0]}-`;
    } else {
        fileName += '0-';
    }

    if (data.isProp) {
        fileName += 'prop-';
    }

    if (!isShared) {
        if (data.sex === 1) {
            fileName += `male-`;
        } else {
            fileName += 'female-';
        }
    }

    fileName += data.drawables[0];
    fileName += `.png`;

    // componentIdentifier-dlcHash-isProp?-isNotShared?-drawableID
    return ResolvePath(fileName);
}
