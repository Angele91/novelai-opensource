import { WithImageMarkExtension } from "@/components/RemirrorEditor/extensions/WithImageMark";

/**
 * Returns an array of editor extensions.
 *
 * @return {Array} An array of editor extensions.
 */
export default function getEditorExtensions() {
  return [
    new WithImageMarkExtension(),
  ]
}