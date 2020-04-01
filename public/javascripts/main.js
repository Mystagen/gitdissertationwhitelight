
function subNavOptionClick(parsedId) {
    subNavOptions = document.getElementsByClassName('subnavOption');
    for (var i = 0; i < subNavOptions.length; i++) {
        if (subNavOptions[i].id == parsedId) {
            subNavOptions[i].setAttribute("class", "subnavOption subSelected")
        } else {
            subNavOptions[i].setAttribute("class", "subnavOption")
        }
    }
}

function categoryChange(clickedId) {
    categorySet = document.getElementsByClassName("groupByCategory")[0];
    groupSet = document.getElementsByClassName("groupByGroup")[0];
    if (clickedId == "categoryFilter") {
        categorySet.setAttribute("class", "groupByCategory visible");
        groupSet.setAttribute("class", "groupByGroup");
    } else {
        categorySet.setAttribute("class", "groupByCategory");
        groupSet.setAttribute("class", "groupByGroup visible");
    }
}

function groupViewChange(clickedId) {
    inGroupSet = document.getElementsByClassName("groupMembers")[0];
    notInGroupSet = document.getElementsByClassName("noGroupMembers")[0];
    if (clickedId == "groupMembersFilter") {
        inGroupSet.setAttribute("class", "groupMembers visible");
        notInGroupSet.setAttribute("class", "noGroupMembers hidden");
    } else {
        inGroupSet.setAttribute("class", "groupMembers hidden");
        notInGroupSet.setAttribute("class", "noGroupMembers visible");
    }
}

function navSetup() {
    selectedNav = document.getElementsByClassName("navSelected")[0];
    selectedNavSubMenu = document.getElementById(selectedNav.textContent + "SubNav");
    selectedNavSubMenu.setAttribute("class", "asideSubNav asideSubNavVisible")
}

function subNavSetup() {
    subNavOptions = document.getElementsByClassName('subnavOption');
    for (var i = 0; i < subNavOptions.length; i++) {
        subNavOptions[i].setAttribute("id", i);
        subNavOptions[i].addEventListener("click", function(){subNavOptionClick(this.id)});
    }

    categoryButton = document.getElementById('categoryFilter');
    groupButton = document.getElementById('groupFilter');
    if (categoryButton != null && groupButton != null) {
        categoryButton.addEventListener("click", function(){categoryChange(this.id)});
        groupButton.addEventListener("click", function(){categoryChange(this.id)});
    }

    groupMembersButton = document.getElementById('groupMembersFilter');
    addToGroupButton = document.getElementById('addToGroupFilter');
    if (groupMembersButton != null && addToGroupFilter != null) {
        groupMembersButton.addEventListener("click", function(){groupViewChange(this.id)});
        addToGroupButton.addEventListener("click", function(){groupViewChange(this.id)});
    }
}

function addNewInfrastructure() {
    //Take name, category id and group id and insert into DB
    nameField = document.getElementById('infrastructureNameField');
    categoryField = document.getElementById('infrastructureCategoryField');
    groupField = document.getElementById('infrastructureGroupField');
    infrastructureDescriptionField = document.getElementById('infrastructureDescription');

    extraFields = document.getElementsByClassName('additionalFieldSection');
    extraData = [[],[]];
    extraDataDataType = [];
    for (i=0; i<extraFields.length; i++) {
        extraData[0].push(extraFields[i].children[0].textContent);
        extraData[1].push(extraFields[i].children[1].value);
        extraDataDataType.push(extraFields[i].children[1].type);
    }

    if (nameField.value != "") {
        window.location.href ="./index.html?mode=addInfrastructure&name=" + nameField.value + "&category=" + categoryField.value + "&description=" + infrastructureDescriptionField.value + "&group=" + groupField.value + "&extraData=" + extraData + "&extraDataDataTypes=" + extraDataDataType;
    } else {
        displayError("Please ensure you have entered a name")
    }
}

function deleteInfrastructure() {
    infrastructureID = document.getElementById('infrastructureID').textContent;
    greyOut = document.getElementById('greyOut');
    confirmation = document.getElementById('confirmation');
    confirmationMessage = document.getElementById('confirmationMessage');
    confirmationURL = document.getElementById('confirmationURL');
    infrastructureName = document.getElementById('infrastructureName');

    confirmationURL.textContent = "./index.html?mode=deleteInfrastructure&id=" + infrastructureID;
    confirmationMessage.textContent = "Are you sure you want to delete " + infrastructureName.textContent;
    
    greyOut.style["visibility"] = "visible";
    confirmation.style["visibility"] = "visible";
}

function infrastructureClick(clickedId) {
    window.location.href = "./infrastructureInformation.html";
}

function passwordClick(clickedId) {
    window.location.href = "./accountInformation.html?id=" + clickedId;
}

function editAccessClick(clickedId) {
    window.location.href = "./editAccessRights.html";
}

function backToInfrastructure() {
    window.location.href = "./index.html";
}

function backToGroups() {
    window.location.href = "./allGroups.html";
}

function backToPasswords() {
    window.location.href = "./passwords.html";
}

function backToAccess() {
    window.location.href = "./accessRights.html";
}

function editInfrastructure() {
    infrastructureID = document.getElementById("infrastructureID").textContent;
    window.location.href = "./addItem.html?mode=editInfrastructure&id=" + infrastructureID;
}

function cancelInfrastructureEdit() {
    infrastructureID = document.getElementById('infrastructureID').textContent;
    window.location.href = "./infrastructureInformation.html?infrastructureID=" + infrastructureID;
}

function updateInfrastructure() {
    infrastructureID = document.getElementById('infrastructureID').textContent;
    infrastructureName = document.getElementById('infrastructureNameField').value;
    infrastructureCategory = document.getElementById('infrastructureCategoryField').value;
    infrastructureGroup = document.getElementById('infrastructureGroupField').value;
    infrastructureDescription = document.getElementById('infrastructureDescription').value;

    extraFields = document.getElementsByClassName('additionalFieldSection');
    extraData = [[],[]];
    extraDataDataType = [];
    for (i=0; i<extraFields.length; i++) {
        extraData[0].push(extraFields[i].children[0].textContent);
        extraData[1].push(extraFields[i].children[1].value);
        extraDataDataType.push(extraFields[i].children[1].type);
    }

    window.location.href = "./infrastructureInformation.html?mode=updateInfrastructure&infrastructureID=" + infrastructureID + "&name=" + infrastructureName + "&category=" + infrastructureCategory + "&description=" + infrastructureDescription + "&group=" + infrastructureGroup + "&extraData=" + extraData + "&extraDataDataTypes=" + extraDataDataType; 
}

function confirmationAction() {
    url = document.getElementById('confirmationURL').textContent;
    window.location.href = url;
}

function confirmationCancel() {
    greyOut = document.getElementById('greyOut');
    confirmation = document.getElementById('confirmation');

    greyOut.style["visibility"] = "hidden";
    confirmation.style["visibility"] = "hidden";
}

function errorOKClick() {
    greyOut = document.getElementById('greyOut');
    errorMessage = document.getElementById('errorMessage');

    greyOut.style["visibility"] = "hidden";
    errorMessage.style["visibility"] = "hidden";
}

function addNewGroup() {
    groupName = document.getElementById("groupNameField").value;
    groupDescription = document.getElementById("groupDescription").value;

    if (groupName != "" && groupDescription != "") {
        window.location.href ="./allGroups.html?mode=addGroup&name=" + groupName + "&description=" + groupDescription;
    } else {
        displayError("Please ensure you have entered a name and description");
    }
}

function editGroup() {
    groupID = document.getElementById("groupID").textContent;
    window.location.href = "./addGroup.html?mode=editGroup&id=" + groupID;
}

function deleteGroup() {
    groupID = document.getElementById('groupID').textContent;
    greyOut = document.getElementById('greyOut');
    confirmation = document.getElementById('confirmation');
    confirmationMessage = document.getElementById('confirmationMessage');
    confirmationURL = document.getElementById('confirmationURL');
    groupName = document.getElementById('groupName');

    confirmationURL.textContent = "./allGroups.html?mode=deleteGroup&id=" + groupID;
    confirmationMessage.textContent = "Are you sure you want to delete " + groupName.textContent;
    
    greyOut.style["visibility"] = "visible";
    confirmation.style["visibility"] = "visible";
}

function cancelGroupEdit() {
    groupID = document.getElementById('groupID').textContent;
    window.location.href = "./manageGroup.html?groupID=" + groupID;
}

function updateGroups() {
    groupID = document.getElementById('groupID').textContent;
    groupName = document.getElementById('groupNameField').value;
    groupDescription = document.getElementById('groupDescription').value;
    
    window.location.href = "./manageGroup.html?mode=updateGroup&groupID=" + groupID + "&name=" + groupName + "&description=" + groupDescription; 
}

function backToCategories() {
    window.location.href = "./allCategories.html";
}

function addNewCategory() {
    categoryName = document.getElementById("categoryName").value;
    categoryDescription = document.getElementById("categoryDescription").value;

    if (categoryName != "" && categoryDescription != "") {
        window.location.href ="./allCategories.html?mode=addCategory&name=" + categoryName + "&description=" + categoryDescription;
    } else {
        displayError("Please ensure you have entered a name and description");
    }
}

function editCategory() {
    categoryID = document.getElementById("categoryID").textContent;
    window.location.href = "./addCategory.html?mode=editCategory&id=" + categoryID;
}

function deleteCategory() {
    categoryID = document.getElementById('categoryID').textContent;
    greyOut = document.getElementById('greyOut');
    confirmation = document.getElementById('confirmation');
    confirmationMessage = document.getElementById('confirmationMessage');
    confirmationURL = document.getElementById('confirmationURL');
    categoryName = document.getElementById('categoryName');

    confirmationURL.textContent = "./allCategories.html?mode=deleteCategory&id=" + categoryID;
    confirmationMessage.textContent = "Are you sure you want to delete " + categoryName.textContent;
    
    greyOut.style["visibility"] = "visible";
    confirmation.style["visibility"] = "visible";
}

function cancelCategoryEdit() {
    categoryID = document.getElementById('categoryID').textContent;
    window.location.href = "./manageCategory.html?categoryID=" + categoryID;
}

function updateCategory() {
    categoryID = document.getElementById('categoryID').textContent;
    categoryName = document.getElementById('categoryName').value;
    categoryDescription = document.getElementById('categoryDescription').value;
    
    window.location.href = "./manageCategory.html?mode=updateCategory&categoryID=" + categoryID + "&name=" + categoryName + "&description=" + categoryDescription;
}

function revealPassword() {
    accountPasswordField = document.getElementById('accountPasswordField');

    if (accountPasswordField != null) {
        if (accountPasswordField.type == "password") {
            accountPasswordField.type = "text";
        } else {
            accountPasswordField.type = "password";
        }
    }
}

function addField() {
    fieldAreas = document.querySelector('#fieldAreas');
    
    fieldName = document.getElementById('addFieldName');
    fieldType = document.getElementById('addFieldType').value;

    //Display error if not all information is entered

    numberOfRows = document.getElementsByClassName("additionalFieldSection").length;

    if (fieldName.value != "") {
        if (fieldName.value == '_id' || fieldName.value == 'id') {
            greyOut = document.getElementById('greyOut');
            errorMessage = document.getElementById('errorMessage');
            errorMessageMessage = document.getElementById('errorMessageMessage');

            errorMessageMessage.textContent = "Fields cannot be named '_id' or 'id'";
            
            greyOut.style["visibility"] = "visible";
            errorMessage.style["visibility"] = "visible";
            
        } else {
            label = document.createElement("label");
            labelText = document.createTextNode(fieldName.value);
            label.appendChild(labelText);
            input = document.createElement("input");
            input.setAttribute("type", fieldType);
            deleteButton = document.createElement("input");
            deleteButton.setAttribute("type", "button");
            deleteButton.setAttribute("value", "Delete");
            deleteButton.setAttribute("id", "button" + numberOfRows);
            deleteButton.setAttribute("class", "deleteExtraAttribute");
            deleteButton.addEventListener("click", function(){deleteAttributeRow(this.id)});
            listSection = document.createElement("li");
            listSection.setAttribute("class", "additionalFieldSection");
            listSection.setAttribute("id", "row" + numberOfRows);
            listSection.appendChild(label);
            listSection.appendChild(input);
            listSection.appendChild(deleteButton);
            fieldAreas.appendChild(listSection);
        }
    }
    fieldName.value = "";
}

function deleteAttributeRow(buttonID) {
    rowID = buttonID.substr(-1);

    targetRow = document.getElementById("row" + rowID);
    targetRow.remove();
}

function displayError(message) {
    greyOut = document.getElementById('greyOut');
    errorMessage = document.getElementById('errorMessage');
    errorMessageMessage = document.getElementById('errorMessageMessage');

    errorMessageMessage.textContent = message;
    
    greyOut.style["visibility"] = "visible";
    errorMessage.style["visibility"] = "visible";
}

function midAddCategory() {
    idRecord = document.getElementById("infrastructureID");
    id="";

    if (idRecord.textContent != "") {
        id = idRecord.textContent;
    }
    
    if (window.location.href.includes("editInfrastructure")) {
        priorLocation = "edit";
    } else {
        priorLocation = "add";
    }

    window.location.href = "./addCategory.html?mode=midAdd&priorLocation=" + priorLocation + "&previous=" + id;
}

function midAddGroup() {
    idRecord = document.getElementById("infrastructureID");
    id="";

    if (idRecord.textContent != "") {
        id = idRecord.textContent;
    }
    
    if (window.location.href.includes("editInfrastructure")) {
        priorLocation = "edit";
    } else {
        priorLocation = "add";
    }

    window.location.href = "./addGroup.html?mode=midAdd&priorLocation=" + priorLocation + "&previous=" + id;
}

function quickCancel() {
    //Only works when editing an exising item of infrastructure
    idRecord = document.getElementById("infrastructureID");
    id="";

    if (idRecord.textContent != "") {
        id = idRecord.textContent;
    }
    
    if (window.location.href.includes("editInfrastructure")) {
        priorLocation = "edit";
    } else {
        priorLocation = "add";
    }

    if (window.location.href.includes("priorLocation=\"edit\"")) {
        window.location.href = "./addItem.html?mode=editInfrastructure&id=" + id;
    } else {
        window.location.href = "./additem.html";
    }
}

function quickCategoryFinish() {
    idRecord = document.getElementById("infrastructureID");
    id="";

    categoryName = document.getElementById("categoryName").value;
    categoryDescription = document.getElementById("categoryDescription").value;
    

    if (idRecord.textContent != "") {
        id = idRecord.textContent;
    }

    if (window.location.href.includes("editInfrastructure")) {
        priorLocation = "edit";
    } else {
        priorLocation = "add";
    }

    if (categoryName != "" && categoryDescription != "") {
        window.location.href ="./allCategories.html?mode=addCategoryAndReturn&priorLocation=" + priorLocation + "&previous=" + id + "&name=" + categoryName + "&description=" + categoryDescription;
    } else {
        displayError("Please ensure you have entered a name and description");
    }
}

function quickGroupFinish() {
    idRecord = document.getElementById("infrastructureID");
    id="";
    
    groupName = document.getElementById("groupNameField").value;
    groupDescription = document.getElementById("groupDescription").value;


    if (idRecord.textContent != "") {
        id = idRecord.textContent;
    }
    
    if (window.location.href.includes("editInfrastructure")) {
        priorLocation = "edit";
    } else {
        priorLocation = "add";
    }
    
    if (groupName != "" && groupDescription != "") {
        window.location.href ="./allGroups.html?mode=addGroupAndReturn&priorLocation=" + priorLocation + "&previous=" + id + "&name=" + groupName + "&description=" + groupDescription;
    } else {
        displayError("Please ensure you have entered a name and description");
    }
}

function addToGroup(id) {
    groupId = document.getElementById("groupID").textContent;
    window.location.href = "./manageGroup.html?groupID=" + groupId + "&mode=add&itemID=" + id;
}

function removeFromGroup(id) {
    groupId = document.getElementById("groupID").textContent;
    window.location.href = "./manageGroup.html?groupID=" + groupId + "&mode=remove&itemID=" + id;
}

function addNewAccount() {
    accountName = document.getElementById("addAccountAccountName").value;
    username = document.getElementById("addAccountUsername").value;
    password = document.getElementById("addAccountPassword").value;
    description = document.getElementById("addAccountDescription").value;
    
    if (accountName != "" && username != "" && password != "" && description != "") {
        window.location.href = "./passwords.html?mode=addAccount&username=" + username + "&password=" + password + "&description=" + description + "&name=" + accountName;
    } else {
        displayError("Please ensure you have entered all information");
    }
}

function backToAccounts() {
    window.location.href = "./passwords.html";
}

function copyToClickboard() {
    passwordText = document.getElementById("accountPasswordField");

    element = document.createElement('textarea');

    element.value = passwordText.value;
    document.body.appendChild(element);
    element.select();
    document.execCommand('copy');
    document.body.removeChild(element);

    alert("Copied password");
}

function editAccount() {
    accountID = document.getElementById("accountID").textContent;

    window.location.href = "./addAccount.html?mode=edit&id=" + accountID;
}

function cancelAccountEdit() {
    accountID = document.getElementById('accountID').textContent;
    window.location.href = "./accountInformation.html?id=" + accountID;
}

function updateAccount() {
    accountID = document.getElementById('accountID').textContent;
    accountName = document.getElementById('addAccountAccountName').value;
    accountUsername = document.getElementById('addAccountUsername').value;
    accountPassword = document.getElementById('addAccountPassword').value;
    accountDescription = document.getElementById('addAccountDescription').value;

    window.location.href = "./accountInformation.html?mode=update&id=" + accountID + "&name=" + accountName + "&username=" + accountUsername + "&password=" + accountPassword + "&description=" + accountDescription;
}

function deleteAccount() {
    accountID = document.getElementById('accountID').textContent;

    greyOut = document.getElementById('greyOut');
    confirmation = document.getElementById('confirmation');
    confirmationMessage = document.getElementById('confirmationMessage');
    confirmationURL = document.getElementById('confirmationURL');
    accountName = document.getElementById('accountName');

    confirmationURL.textContent = "./passwords.html?mode=delete&id=" + accountID;
    confirmationMessage.textContent = "Are you sure you want to delete " + accountName.textContent;
    
    greyOut.style["visibility"] = "visible";
    confirmation.style["visibility"] = "visible";
}

function pageSetup() {
    //infrastuctureButtons = document.getElementsByClassName("itemButton");
    passwordRevealButton = document.getElementById("passwordRevealButton");
    copyButton = document.getElementById("copyButton");
    infrastructureDetailBackButton = document.getElementById("infrastructureBackButton");
    infrastructureFinishButton = document.getElementById("infrastructureFinishButton");
    infrastructureEditButton = document.getElementById("infrastructureEditButton");
    infrastructureCancelEditButton = document.getElementById("infrastructureCancelEditButton");
    infrastructureEditFinishButton = document.getElementById("infrastructureEditFinishButton");
    accountCancelEditButton = document.getElementById("accountCancelEditButton");
    accountEditFinishButton = document.getElementById("accountEditFinishButton");
    groupBackButton = document.getElementById("groupBackButton");
    groupEditButton = document.getElementById("groupEditButton");
    groupDeleteButton = document.getElementById("groupDeleteButton")
    groupFinishButton = document.getElementById("groupFinishButton");
    groupCancelEditButton = document.getElementById("groupCancelEditButton");
    groupEditFinishButton = document.getElementById("groupEditFinishButton");
    categoryBackButton = document.getElementById("categoryBackButton");
    categoryEditButton = document.getElementById("categoryEditButton");
    categoryDeleteButton = document.getElementById("categoryDeleteButton");
    categoryFinishButton = document.getElementById("categoryFinishButton");
    categoryCancelEditButton = document.getElementById("categoryCancelEditButton");
    categoryEditFinishButton = document.getElementById("categoryEditFinishButton");
    groupQuickCancelEditButton = document.getElementById("groupQuickCanclEditButton");
    groupQuickEditFinishButton = document.getElementById("groupQuickEditFinishButton");
    categoryQuickCancelEditButton = document.getElementById("categoryQuickCancelEditButton");
    categoryQuickEditFinishButton = document.getElementById("categoryQuickEditFinishButton");
    passwordButtons = document.getElementsByClassName("passwordButton");
    passwordBackButton = document.getElementById("accountBackButton");
    editAccessButtons = document.getElementsByClassName("editAccess");
    accessBackButton = document.getElementById("accessBackButton");
    infrastructureDeleteButton = document.getElementById("infrastructureDeleteButton");
    confirmationYesButton = document.getElementById("confirmationYes");
    confirmationNoButton = document.getElementById("confirmationNo");
    addFieldSubmit = document.getElementById("addFieldSubmit");
    errorOK = document.getElementById("errorOK");
    midAddAddCategoryButton = document.getElementById("midAddAddCategoryButton");
    midAddAddGroupButton = document.getElementById("midAddAddGroupButton");
    addGroupItemButtons = document.getElementsByClassName("addGroupItemButton");
    removeGroupItemButtons = document.getElementsByClassName("removeGroupItemButton");
    deleteExtraAttribute = document.getElementsByClassName("deleteExtraAttribute");
    accountFinishButton = document.getElementById("accountFinishButton");
    accountBackButton = document.getElementById("accountBackButton");
    accountInformationBackButton = document.getElementById("accountInformationBackButton");
    accountInformationEditButton = document.getElementById("accountInformationEditButton");
    accountInformationDeleteButton = document.getElementById("accountInformationDeleteButton");

    for (i=0; i<deleteExtraAttribute.length; i++) {
        deleteExtraAttribute[i].addEventListener("click", function(){deleteAttributeRow(this.id)});
    }
    
    /*
    for (var i = 0; i < infrastuctureButtons.length; i++) {
        infrastuctureButtons[i].addEventListener("click", function(){infrastructureClick(this.id)});
    }*/

    for (var i = 0; i < passwordButtons.length; i++) {
        passwordButtons[i].addEventListener("click", function(){passwordClick(this.id)});
    }

    for (var i = 0; i < editAccessButtons.length; i++) {
        editAccessButtons[i].addEventListener("click", function(){editAccessClick(this.id)});
    }

    for (var i = 0; i < addGroupItemButtons.length; i++) {
        addGroupItemButtons[i].addEventListener("click", function(){addToGroup(this.id)});
    }

    for (var i = 0; i < removeGroupItemButtons.length; i++) {
        removeGroupItemButtons[i].addEventListener("click", function(){removeFromGroup(this.id)});
    }

    if (accountInformationBackButton != null) {
        accountInformationBackButton.addEventListener("click", function(){backToPasswords()});
    }

    if (accountInformationDeleteButton != null) {
        accountInformationDeleteButton.addEventListener("click", function(){deleteAccount()});
    }

    if (accountInformationEditButton != null) {
        accountInformationEditButton.addEventListener("click", function(){editAccount()});
    }

    if (passwordRevealButton != null) {
        passwordRevealButton.addEventListener("click", function(){revealPassword()});
    }

    if (copyButton != null) {
        copyButton.addEventListener("click", function(){copyToClickboard()});
    }

    if (accountFinishButton != null) {
        accountFinishButton.addEventListener("click", function(){addNewAccount()});
    }

    if (accountBackButton != null) {
        accountBackButton.addEventListener("click", function(){backToAccounts()});
    }

    if (groupQuickCancelEditButton != null) {
        groupQuickCancelEditButton.addEventListener("click", function(){quickCancel()});
    }

    if (groupQuickEditFinishButton != null) {
        groupQuickEditFinishButton.addEventListener("click", function(){quickGroupFinish()});
    }

    if (categoryQuickCancelEditButton != null) {
        categoryQuickCancelEditButton.addEventListener("click", function(){quickCancel()});
    }

    if (categoryQuickEditFinishButton != null) {
        categoryQuickEditFinishButton.addEventListener("click", function(){quickCategoryFinish()});
    }

    if (accountCancelEditButton != null) {
        accountCancelEditButton.addEventListener("click", function(){cancelAccountEdit()});
    }

    if (accountEditFinishButton != null) {
        accountEditFinishButton.addEventListener("click", function(){updateAccount()});
    }

    if (midAddAddCategoryButton != null) {
        midAddAddCategoryButton.addEventListener("click", function(){midAddCategory()});
    }

    if (midAddAddGroupButton != null) {
        midAddAddGroupButton.addEventListener("click", function(){midAddGroup()});
    }

    if (errorOK != null) {
        errorOK.addEventListener("click", function(){errorOKClick()});
    }

    if (infrastructureEditButton != null) {
        infrastructureEditButton.addEventListener("click", function(){editInfrastructure()});
    }

    if (infrastructureCancelEditButton != null) {
        infrastructureCancelEditButton.addEventListener("click", function(){cancelInfrastructureEdit()});
    }

    if (infrastructureEditFinishButton != null) {
        infrastructureEditFinishButton.addEventListener("click", function(){updateInfrastructure()});
    }
 
    if (groupBackButton != null) {
        groupBackButton.addEventListener("click", function(){backToGroups()});
    }

    if (groupFinishButton != null) {
        groupFinishButton.addEventListener("click", function(){addNewGroup()});
    }

    if (groupEditButton != null) {
        groupEditButton.addEventListener("click", function(){editGroup()});
    }

    if (groupDeleteButton != null) {
        groupDeleteButton.addEventListener("click", function(){deleteGroup()});
    }

    if (groupCancelEditButton != null) {
        groupCancelEditButton.addEventListener("click", function(){cancelGroupEdit()});
    }

    if (groupEditFinishButton != null) {
        groupEditFinishButton.addEventListener("click", function(){updateGroups()});
    }

    if (categoryBackButton != null) {
        categoryBackButton.addEventListener("click", function(){backToCategories()});
    }

    if (categoryFinishButton != null) {
        categoryFinishButton.addEventListener("click", function(){addNewCategory()});
    }

    if (categoryEditButton != null) {
        categoryEditButton.addEventListener("click", function(){editCategory()});
    }

    if (categoryDeleteButton != null) {
        categoryDeleteButton.addEventListener("click", function(){deleteCategory()});
    }

    if (categoryCancelEditButton != null) {
        categoryCancelEditButton.addEventListener("click", function(){cancelCategoryEdit()});
    }

    if (categoryEditFinishButton != null) {
        categoryEditFinishButton.addEventListener("click", function() {updateCategory()});
    }

    if (confirmationYesButton != null) {
        confirmationYesButton.addEventListener("click", function(){confirmationAction()});
    }

    if (confirmationNoButton != null) {
        confirmationNoButton.addEventListener("click", function(){confirmationCancel()});
    }

    if (infrastructureDetailBackButton != null) {
        infrastructureDetailBackButton.addEventListener("click", function(){backToInfrastructure()});
    }

    if (infrastructureDeleteButton != null) {
        infrastructureDeleteButton.addEventListener("click", function(){deleteInfrastructure()});
    }

    if (infrastructureFinishButton != null) {
        infrastructureFinishButton.addEventListener("click", function(){addNewInfrastructure()});
    }

    if (passwordBackButton != null) {
        passwordBackButton.addEventListener("click", function(){backToPasswords()});
    }

    if (accessBackButton != null) {
        accessBackButton.addEventListener("click", function(){backToAccess()});
    }

    if (addFieldSubmit != null) {
        addFieldSubmit.addEventListener("click", function(){addField()});
    }


    //GET value detection
    if (window.location.href.indexOf('?groupDeleteFailed') > 0) {
        displayError("You cannot delete a group while it has infrastructure assigned to it");
    }

    if (window.location.href.indexOf('?categoryDeleteFailed') > 0) {
        displayError("You cannot delete a category while it has infrastructure assigned to it");
    }

    if (window.location.href.indexOf('?groupAddFailed') > 0) {
        displayError("A group with that name already exists");
    }

    if (window.location.href.indexOf('?categoryAddFailed') > 0) {
        displayError("A catgory with that name already exists");
    }

    //Clean URL to prevent accidental double insertion
    mode = new URLSearchParams(window.location.search).get('mode');
    //Contains all modes that refreshing should be prevented on
    blockRefreshModes = ["addInfrastructure", "deleteInfrastructure", "addGroup", "deleteGroup", "addCategory", "deleteCategory", "addAccount"];
    if (blockRefreshModes.includes(mode)) {
        window.history.replaceState(null, null, window.location.pathname);
    }
}


function loadFunction() {
    navSetup();
    subNavSetup();
    pageSetup();
}

document.addEventListener("DOMContentLoaded", loadFunction);