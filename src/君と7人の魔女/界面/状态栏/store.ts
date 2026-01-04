import { defineMvuDataStore } from '@/util/mvu';
import type { Schema as SchemaType } from '../../schema';
import { Schema } from '../../schema';

const _useDataStore = defineMvuDataStore(Schema, {
  type: 'message',
  message_id: getCurrentMessageId(),
});

export function useDataStore(): { data: Ref<SchemaType> } {
  return _useDataStore() as any;
}
