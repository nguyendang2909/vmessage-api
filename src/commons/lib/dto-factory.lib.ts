import { Type } from '@nestjs/common';
import { IntersectionType } from '@nestjs/swagger';

import { CreateOneDto } from '../dto/create-one.dto';
import { FindDto } from '../dto/find.dto';
import { FindManyDto } from '../dto/find-many.dto';
import { FindManyByLastIdDto } from '../dto/find-many-by-last-id.dto';
import { FindManyPaginationDto } from '../dto/find-many-pagination.dto';
import { UpdateOneDto } from '../dto/update-one.dto';

export class DtoFactory {
  public static createOne<A>(obj: Type<A>) {
    return IntersectionType(obj, CreateOneDto);
  }

  public static findMany<A>(obj: Type<A>) {
    return IntersectionType(obj, FindManyDto);
  }

  public static findManyPagination<A>(obj: Type<A>) {
    return IntersectionType(obj, FindManyPaginationDto);
  }

  public static findManyByLastId<A>(obj: Type<A>) {
    return IntersectionType(obj, FindManyByLastIdDto);
  }

  public static findOneById<A>(obj: Type<A>) {
    return IntersectionType(obj, FindDto);
  }

  public static updateOne<A>(obj: Type<A>) {
    return IntersectionType(obj, UpdateOneDto);
  }
}
