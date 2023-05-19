export interface ClothingListComponentData {
    [component: number]: {
        [drawable: number]: number;
    };
}

export interface ClothingList {
    clothing: { 
        [dlc: number]: ClothingListComponentData 
    };
    props: { 
        [dlc: number]: ClothingListComponentData 
    };
}
