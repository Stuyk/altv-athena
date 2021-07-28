import { IStreamConfig } from '../../../shared/interfaces/IStream';

const StreamConfiguration: IStreamConfig = {
    TimeBetweenUpdates: 1000, // 1s
    LabelsDistance: 100,
    MarkersDistance: 100,
    ObjectsDistance: 100
};

export default StreamConfiguration;
