export class EntityModel {
    name: string;
    entityCode: string;
    description: string;
    activationStatus: string;
    parent: string;
    processingStatus: string;
    entityId: string;

    constructor(name: string, entityCode: string, description: string, activationStatus: string,parent: string ) {
      this.name = name;
      this.entityCode = entityCode;
      this.description = description;
      this.activationStatus = activationStatus;
      this.description = description;
    }
  
  }

  