export default function(date){
    const transferDate = new Date(date*1000);
    const string = transferDate.getFullYear() + '/' + (transferDate.getMonth()+1) + '/' + transferDate.getDate();
    return string;
};