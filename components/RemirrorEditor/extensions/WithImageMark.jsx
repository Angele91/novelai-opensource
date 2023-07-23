import { MarkExtension, command, toggleMark } from "remirror";

export class WithImageMarkExtension extends MarkExtension {
  get name() {
    return 'withImage'
  }

  get defaultOptions() {
    return {
      markType: 'image',
    }
  }

  createMarkSpec(extra, override) {
    return {
      ...override,
      attrs: {
        imageId: {},
        ...extra.defaults(),
      },
      parseDOM: [
        {
          tag: 'span[data-img]',
          getAttrs: (dom) => ({
            imageId: dom.dataset.img,
            ...extra.parse(dom),
          }),
        },
        ...(extra.parseDOM || []),
      ],
      toDOM: (node) => [
        'span',
        {
          'data-img': node.attrs.imageId,
          class: 'with-image'
        },
        0,
      ],
    }
  }

  @command()
  toggleImage(attrs, selection) {
    return toggleMark({ type: this.type, attrs, selection })
  }
}