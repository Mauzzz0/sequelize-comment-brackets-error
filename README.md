# Scripts to test:
```bash
npm ci
npm run success # successful case
npm run fail # failed case
```

# Issue
I am not sure is this problem with sequelize-typescript or sequelize, so please correct me.
Syntax error when trying to add enum column with comment that ends with bracket ")".
Other type (tested with `DataType.TEXT`) works as expected, without problems.

## Versions
- sequelize: 6.37.1
- sequelize-typescript: 2.1.6
- typescript: 5.3.3
- pg: 8.11.3

## Issue type

- [x] bug report
- [ ] feature request

## Actual behavior
For example (code in below section) sequelize creates this SQL (prettified):
```
DO
'BEGIN
CREATE TYPE "public"."enum_Model_status" AS ENUM(''active'', ''pending'', ''available'', ''inactive'', ''suspended'');
EXCEPTION WHEN duplicate_object THEN null;
END';
ALTER TABLE "public"."Model" ADD COLUMN "status" "public"."enum_Model_status"'; <--- Here is unnecessary single quote
```
And at the end you can see syntax error with unnecessary one single quote, between `status"` and `;`
Error: `unterminated quoted string at or near "';"`

## Expected behavior
* Successfully creates column with comment with brackets

## Steps to reproduce
* Initialize sequelize, add one model
* Using queryInterface add `enum` column with any comment that ends with symbol `)`
* I will get syntax error like mentioned above.

## Related code
Link to small reproducable repo: https://github.com/Mauzzz0/sequelize-comment-brackets-error  
With two files: `case_fail.ts`, `case_success.ts`

```ts
export enum StatusEnum {
  active = 'active',
  pending = 'pending',
  available = 'available',
  inactive = 'inactive',
  suspended = 'suspended',
}
const qi = sequelize.getQueryInterface();
```

Failed example:
```ts
await qi.addColumn(ModelEntity.tableName, 'status',
  {
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(StatusEnum),
    defaultValue: StatusEnum.available,
    comment: 'Comment ends with brackets)',
  }, { transaction });
```

Successfull example:
```ts
await qi.addColumn(ModelEntity.tableName, 'status',
  {
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(StatusEnum),
    defaultValue: StatusEnum.available,
    comment: 'Normal comment',
  }, { transaction });
```