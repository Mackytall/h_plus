export * from './users';
import { FastifyRequest } from 'fastify';
import { Bucket, StorageClass, MetadataEntry, Tag } from '@aws-sdk/client-s3';

export type MulterFile = {
  size: number;
  bucket: Bucket;
  key: string;
  acl: string;
  contentType: string;
  metadata: MetadataEntry;
  location: string;
  etag: Tag;
  contentDisposition: string;
  storageClass: StorageClass;
  versionId: string;
  contentEncoding: string;
};

export interface MulterRequest extends FastifyRequest {
  file: MulterFile;
}
