export declare namespace DMMF {
  interface Document {
      datamodel: Datamodel;
      schema: Schema;
      mappings: Mapping[];
  }
  interface Enum {
      name: string;
      values: string[];
      dbName?: string | null;
  }
  interface Datamodel {
      models: Model[];
      enums: Enum[];
  }
  interface Model {
      name: string;
      isEmbedded: boolean;
      dbName: string | null;
      fields: Field[];
      idFields: string[];
  }
  type FieldKind = 'scalar' | 'object' | 'enum';
  type DatamodelFieldKind = 'scalar' | 'relation' | 'enum';
  interface Field {
      kind: DatamodelFieldKind;
      name: string;
      isRequired: boolean;
      isList: boolean;
      isUnique: boolean;
      isId: boolean;
      type: string;
      dbName: string | null;
      isGenerated: boolean;
      relationToFields?: any[];
      relationOnDelete?: string;
      relationName?: string;
  }
  interface Schema {
      rootQueryType?: string;
      rootMutationType?: string;
      inputTypes: InputType[];
      outputTypes: OutputType[];
      enums: Enum[];
  }
  interface QueryOutput {
      name: string;
      isRequired: boolean;
      isList: boolean;
  }
  type ArgType = string;
  interface SchemaArg {
      name: string;
      inputType: {
          isRequired: boolean;
          isList: boolean;
          type: ArgType;
          kind: FieldKind;
      };
      isRelationFilter?: boolean;
  }
  interface OutputType {
      name: string;
      fields: SchemaField[];
      isEmbedded?: boolean;
  }
  interface SchemaField {
      name: string;
      outputType: {
          type: string;
          isList: boolean;
          isRequired: boolean;
          kind: FieldKind;
      };
      args: SchemaArg[];
  }
  interface InputType {
      name: string;
      isWhereType?: boolean;
      isOrderType?: boolean;
      atLeastOne?: boolean;
      atMostOne?: boolean;
      fields: SchemaArg[];
  }
  interface Mapping {
      model: string;
      findOne?: string;
      findMany?: string;
      create?: string;
      update?: string;
      updateMany?: string;
      upsert?: string;
      delete?: string;
      deleteMany?: string;
  }
  enum ModelAction {
      findOne = "findOne",
      findMany = "findMany",
      create = "create",
      update = "update",
      updateMany = "updateMany",
      upsert = "upsert",
      delete = "delete",
      deleteMany = "deleteMany"
  }
}
export declare namespace JsonRPC {
  type Request = {
      jsonrpc: '2.0';
      method: string;
      params?: any;
      id: number;
  };
  type Response = SuccessResponse | ErrorResponse;
  type SuccessResponse = {
      jsonrpc: '2.0';
      result: any;
      id: number;
  };
  type ErrorResponse = {
      jsonrpc: '2.0';
      error: {
          code: number;
          message: string;
          data: any;
      };
      id: number;
  };
}
export declare type Dictionary<T> = {
  [key: string]: T;
};
export interface GeneratorConfig {
  name: string;
  output: string | null;
  provider: string;
  config: Dictionary<string>;
  binaryTargets: string[];
}
export interface EnvValue {
  fromEnvVar: null | string;
  value: string;
}
export declare type ConnectorType = 'mysql' | 'mongo' | 'sqlite' | 'postgresql';
export interface DataSource {
  name: string;
  connectorType: ConnectorType;
  url: EnvValue;
  config: {
      [key: string]: string;
  };
}
export declare type BinaryPaths = {
  migrationEngine?: {
      [binaryTarget: string]: string;
  };
  queryEngine?: {
      [binaryTarget: string]: string;
  };
  introspectionEngine?: {
      [binaryTarget: string]: string;
  };
};
export declare type GeneratorOptions = {
  generator: GeneratorConfig;
  otherGenerators: GeneratorConfig[];
  schemaPath: string;
  dmmf: DMMF.Document;
  datasources: DataSource[];
  datamodel: string;
  binaryPaths?: BinaryPaths;
  version: string;
};
export declare type EngineType = 'queryEngine' | 'migrationEngine' | 'introspectionEngine';
export declare type GeneratorManifest = {
  prettyName?: string;
  defaultOutput?: string;
  denylists?: {
      models?: string[];
      fields?: string[];
  };
  requiresGenerators?: string[];
  requiresEngines?: EngineType[];
  version?: string;
};
