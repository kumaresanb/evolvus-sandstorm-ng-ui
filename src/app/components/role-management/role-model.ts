export class RoleModel {
  roleName: string;
  description: string;
  applicationCode: string;
  activationStatus: string;
  menuGroup: MenuGroup[];


  constructor(
    roleName: string,
    description: string,
    applicationCode: string,
    activationStatus: string,
    menuGroup: MenuGroup[]
  ) {
    this.roleName = roleName;
    this.description = description;
    this.applicationCode = applicationCode;
    this.activationStatus = activationStatus;
    this.menuGroup = menuGroup;
  }

}

export class MenuGroup
  {
    applicationCode: string;
    menuGroupCode: string;
    title: string;
    menuItems: MenuItems[];
    selectedFlag: boolean;

    constructor(
      applicationCode: string,
      menuGroupCode: string,
      title: string,
      menuItems: MenuItems[],
      selectedFlag: boolean

    ) {
      this.applicationCode = applicationCode;
      this.menuGroupCode = menuGroupCode;
      this.title = title;
      this.menuItems = menuItems;
      this.selectedFlag = selectedFlag;

    }
    


    
}
export class MenuItems
  {
    menuItemType: string;
    applicationCode: string;
    menuItemCode: string;
    title: string;
    selectedFlag: boolean;
    subMenuItems: MenuItems[]
    constructor(
      menuItemType: string,
      applicationCode: string,
      menuItemCode: string,
      title: string,
      selectedFlag: boolean
    ) {
      this.menuItemType = menuItemType;
      this.applicationCode = applicationCode;
      this.menuItemCode = menuItemCode;
      this.title = title;
      this.selectedFlag = selectedFlag;

    }
    


    
}