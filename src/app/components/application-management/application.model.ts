export class ApplicationModel {
  _id: string;
  applicationId: number;
  applicationCode: string;
  applicationName: string;
  description: string;
  enabled: boolean;
  logo: string;
  favicon: string;

  constructor(_id: string, applicationId: number, applicationCode: string, applicationName: string, description: string, enabled: boolean, logo: string, favicon: string) {
    this._id = _id;
    this.applicationId = applicationId;
    this.applicationId = applicationId;
    this.applicationName = applicationName;
    this.description = description;
    this.enabled = enabled;
    this.logo = logo;
    this.favicon = favicon;
  }

}
