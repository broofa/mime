interface IDictionary<TValue> {
    [id: string]: TValue;
}

declare class Mime {
    constructor(...typeMaps: IDictionary<string[]>[]);

    getType(extension: string): string | null;

    getExtension(mimeType: string): string | null;
}

export const _default: Mime;
export default _default;
