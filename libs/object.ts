import { canonicalize } from 'json-canonicalize'
import { hash } from './hash'

export function id(obj: any) {
  return hash(canonicalize(obj))
}
