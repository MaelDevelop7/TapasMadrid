const companyName : string = "Mael Develop";
const versionTag: number = 2.0;
let isStable: boolean = true;
let year: number = new Date().getFullYear();


function checkStable(){
    if(isStable){
        return "Stable";
    }   
    else{
        return "Beta";
    }

}
const credits = ` ${year}, ${companyName} in version ${versionTag} ${checkStable()}`


export { credits, versionTag }
