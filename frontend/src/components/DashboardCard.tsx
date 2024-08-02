interface DashboardCardProps {
    title: string;
    value: number;
  }
  
  const DashboardCard: React.FC<DashboardCardProps> = ({ title, value }) => {
    let textColor = '';
    let sign = '';
    let bgColor = ''

    if (title === 'Income') {
      textColor = 'text-green-500';
      sign = '+';
      bgColor = 'bg-green-50'
    } else if (title === 'Expense') {
      textColor = 'text-red-500';
      sign = '-';
      bgColor = 'bg-red-50'
    } else if (title === 'Balance') {
      if (value > 0) {
        textColor = 'text-green-500';
        sign = '+';
      } else if (value === 0) {
        textColor = 'text-brown-500';
        sign = '';
      } else {
        textColor = 'text-red-500';
        sign = '-';
      }
    }
  
    return (
      <div className={`border flex flex-col justify-between rounded-lg ${bgColor} shadow-sm break-words md:p-3 max-sm:p-2`}>
        <div className={`md:text-xl max-sm:text-lg ${textColor} text-center`}>
          {sign}{value}
        </div>
        <div className={`md:text-2xl max-sm:text-sm flex items-center justify-center text-[#6b4226]  hover:text-[#4d2e1b] font-semibold`}>{title}</div>
      </div>
    );
  };
  
  export default DashboardCard;
  