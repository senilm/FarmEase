export function formatDate(dateString: string | undefined): string {
  if(dateString){

    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }else{
    return ""
  }
  }

  export const reverseDate = (dateString: string) => {
    return dateString.split('-').reverse().join('-');
  }


  export function formatDatePdf(dateString:string) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 1-indexed
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  