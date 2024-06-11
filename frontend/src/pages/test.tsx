//import { UIEvent } from 'react';

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { MockExamReceived } from "../interfaces/MockExam";
import { convertMockExamData } from "../utils/convertMockExamData";

export function Test() {
  const mainQuestionId = "1c513462-bb6e-4334-bb61-2902e930536c"
  const { data: mainQuestionResponse } = useQuery({
    queryKey: ['get-main-questions'],
    queryFn: async () => {
      const response = await fetch(`http://localhost:8080/tests/${mainQuestionId}/complete`);
      const data: MockExamReceived = await response.json();
      
      return convertMockExamData(data);
    },
    placeholderData: keepPreviousData,
    staleTime: Infinity,
  });

  console.log(mainQuestionResponse);

  // try {
  //   const url = window.URL.createObjectURL(mainQuestionResponse?.coverPdfFile as File);
  //   const link = document.createElement('a');
  //   link.href = url;
  //   link.download = 'file.pdf'; // Nome do arquivo para download
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
    
  //   // Limpa a URL criada
  //   window.URL.revokeObjectURL(url);
  // } catch (error) {
  //   console.error('There was a problem with the fetch operation:', error);
  // }
  
  return (
    <>
      <div className='block w-52'>
        <h1>test</h1>
      </div>
    </>
  );
}

