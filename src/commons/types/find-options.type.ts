import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsSelect,
  FindOptionsWhere,
} from 'typeorm';

export type FindOptions = {
  selects: string[];
};

export type EntityFindOneOptions<T> = Omit<
  FindOneOptions<T>,
  'select' | 'where'
> & {
  select: FindOptionsSelect<T>;
  where: FindOptionsWhere<T>[] | FindOptionsWhere<T>;
};

export type EntityFindOneByIdOptions<T> = Omit<
  FindOneOptions<T>,
  'select' | 'where'
> & {
  select: FindOptionsSelect<T>;
};

export type EntityFindManyOptions<T> = Omit<
  FindManyOptions<T>,
  'select' | 'where' | 'take'
> & {
  select: FindOptionsSelect<T>;
  where: FindOptionsWhere<T>[] | FindOptionsWhere<T>;
};
