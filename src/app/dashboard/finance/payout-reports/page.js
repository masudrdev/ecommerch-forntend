"use client";

import { useEffect, useState } from "react";
import { RefreshCcw } from "lucide-react";
import { financeService } from "@/services/finance.service";


const money = (value) =>
  `৳${Number(value || 0).toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;



function StatusBadge({ status }) {


  const colors = {

    PAID:
      "bg-green-500/10 text-green-400 border-green-500/30",

    PENDING:
      "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",

    APPROVED:
      "bg-blue-500/10 text-blue-400 border-blue-500/30",

    REJECTED:
      "bg-red-500/10 text-red-400 border-red-500/30",

    CANCELLED:
      "bg-red-500/10 text-red-400 border-red-500/30",

  };



  return (

    <span
      className={`rounded-full border px-3 py-1 text-xs ${
        colors[status] || "bg-slate-700 text-white"
      }`}
    >
      {status}

    </span>

  );

}





export default function PayoutReportsPage(){


  const [summary,setSummary] = useState({});

  const [payouts,setPayouts] = useState([]);



  const [pagination,setPagination] = useState({

    page:1,

    limit:20,

    total:0,

    totalPages:1,

  });



  const [pageLoading,setPageLoading] = useState(true);

  const [tableLoading,setTableLoading] = useState(false);






  const fetchData = async(
    page=1,
    firstLoad=false
  )=>{


    try{


      if(firstLoad){

        setPageLoading(true);

      }else{

        setTableLoading(true);

      }



      const res =
        await financeService.getPayoutReports({

          page,

          limit:20,

        });




      setSummary(
        res?.summary || {}
      );


      setPayouts(
        res?.payouts || []
      );


      setPagination(
        res?.pagination || {}
      );



    }catch(error){

      console.error(
        "Payout reports error",
        error
      );


    }finally{


      setPageLoading(false);

      setTableLoading(false);


    }


  };







  useEffect(()=>{

    fetchData(1,true);

  },[]);








  const changePage=(page)=>{


    if(
      page < 1 ||
      page > pagination.totalPages
    )
    return;


    fetchData(page,false);


  };






  const refreshData=()=>{


    fetchData(
      pagination.page,
      false
    );


  };






  if(pageLoading){


    return (

      <div className="text-slate-400">

        Loading payout reports...

      </div>

    );


  }







return (

<div className="space-y-6">





<div className="flex items-center justify-between">


<div>

<h1 className="text-3xl font-bold text-white">
Payout Reports
</h1>


<p className="text-sm text-slate-400">
View vendor payout history and payment status.
</p>


</div>




<button

onClick={refreshData}

disabled={tableLoading}

className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"

>


<RefreshCcw

size={16}

className={
tableLoading
?
"animate-spin"
:
""
}

/>


Refresh


</button>



</div>









{/* Cards */}



<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">


<Card

title="Total Requested"

value={money(summary.totalRequested)}

/>


<Card

title="Pending"

value={money(summary.pendingAmount)}

/>


<Card

title="Approved"

value={money(summary.approvedAmount)}

/>


<Card

title="Paid"

value={money(summary.paidAmount)}

/>


<Card

title="Rejected"

value={money(summary.rejectedAmount)}

/>


<Card

title="Cancelled"

value={money(summary.cancelledAmount)}

/>


</div>









{/* Table */}



<div className="rounded-2xl border border-slate-700 bg-slate-800 p-4 md:p-5">



<div className="mb-4 flex items-center justify-between">


<h2 className="text-xl font-semibold text-white">

Payout History

</h2>



{

tableLoading &&

<span className="text-sm text-blue-400">

Updating...

</span>

}



</div>






<div className="w-full overflow-x-auto">


<table className="min-w-[900px] w-full text-left text-sm">


<thead className="border-b border-slate-700 text-slate-300">


<tr>


<th className="py-3">
Payout ID
</th>


<th>
Vendor
</th>


<th>
Amount
</th>


<th>
Payment
</th>


<th>
Status
</th>


<th>
Transaction
</th>


<th>
Paid Date
</th>


<th>
Created
</th>


</tr>


</thead>






<tbody>


{payouts.map((item)=>(


<tr

key={item.id}

className="border-b border-slate-700"

>


<td className="py-3 text-white">

{item.id.slice(0,8)}...

</td>



<td>

{item.vendor}

</td>




<td className="text-green-400 font-semibold">

{money(item.amount)}

</td>




<td>

{item.paymentMethod}

</td>





<td>

<StatusBadge status={item.status}/>

</td>





<td className="text-slate-300">

{item.transactionId || "-"}

</td>





<td className="text-slate-400">

{
item.paidAt
?
new Date(item.paidAt).toLocaleDateString()
:
"-"
}

</td>





<td className="text-slate-400">

{
new Date(item.createdAt)
.toLocaleDateString()
}

</td>



</tr>



))}



</tbody>


</table>


</div>









{/* Pagination */}



<div className="mt-5 flex items-center justify-between">


<p className="text-sm text-slate-400">

Page {pagination.page} of {pagination.totalPages}

</p>





<div className="flex gap-2">



<button

disabled={pagination.page<=1}

onClick={()=>changePage(
pagination.page-1
)}

className="rounded-lg bg-slate-700 px-4 py-2 text-white disabled:opacity-50"

>

Previous

</button>






<button

disabled={
pagination.page>=pagination.totalPages
}

onClick={()=>changePage(
pagination.page+1
)}

className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"

>

Next

</button>



</div>



</div>






</div>






</div>

);

}







function Card({title,value}){


return (

<div className="rounded-2xl border border-slate-700 bg-slate-800 p-5">


<p className="text-sm text-slate-400">

{title}

</p>


<h2 className="mt-2 text-2xl font-bold text-white">

{value}

</h2>


</div>

);


}