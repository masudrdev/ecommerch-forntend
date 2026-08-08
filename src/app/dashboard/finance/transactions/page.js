"use client";

import { useEffect, useState } from "react";
import { RefreshCcw } from "lucide-react";
import { financeService } from "@/services/finance.service";


const money = (value) =>
  `৳${Number(value || 0).toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;



function Badge({value}){

  return (

    <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs text-blue-400">

      {value}

    </span>

  );

}




function StatusBadge({value}){

  const colors={

    COMPLETED:
      "bg-green-500/10 text-green-400 border-green-500/30",

    PENDING:
      "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",

    FAILED:
      "bg-red-500/10 text-red-400 border-red-500/30",

    CANCELLED:
      "bg-slate-500/10 text-slate-400 border-slate-500/30",

  };


  return (

    <span
      className={`rounded-full border px-3 py-1 text-xs ${
        colors[value] ||
        "bg-slate-700 text-white"
      }`}
    >

      {value}

    </span>

  );

}




export default function TransactionsPage(){


const [summary,setSummary]=useState([]);

const [transactions,setTransactions]=useState([]);


const [pagination,setPagination]=useState({

 page:1,

 limit:20,

 total:0,

 totalPages:1

});


const [loading,setLoading]=useState(true);

const [tableLoading,setTableLoading]=useState(false);





const fetchData = async(
 page=1,
 first=false
)=>{

try{


if(first){

 setLoading(true);

}else{

 setTableLoading(true);

}



const res =
 await financeService.getTransactions({

 page,

 limit:20,

 });



setSummary(
 res?.summary || []
);


setTransactions(
 res?.transactions || []
);


setPagination(
 res?.pagination || {}
);



}catch(error){

console.log(
"Transaction error",
error
);


}finally{


setLoading(false);

setTableLoading(false);


}



};






useEffect(()=>{

 fetchData(1,true);

},[]);







const refresh=()=>{

 fetchData(
 pagination.page,
 false
 );

};





const changePage=(page)=>{


if(
 page<1 ||
 page>pagination.totalPages
)
return;


fetchData(page,false);


};








const totalAmount =
summary.reduce(
(acc,item)=>
acc+
Number(item?._sum?.amount || 0),
0
);



const totalCount =
summary.reduce(
(acc,item)=>
acc+
Number(item?._count?.id || 0),
0
);





if(loading){

return (

<div className="text-slate-400">

Loading transactions...

</div>

);

}







return (

<div className="space-y-6">





<div className="flex justify-between items-center">


<div>

<h1 className="text-3xl font-bold text-white">

Transactions

</h1>


<p className="text-sm text-slate-400">

View all finance transactions

</p>


</div>




<button

onClick={refresh}

disabled={tableLoading}

className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white"

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








<div className="grid grid-cols-1 md:grid-cols-4 gap-4">


<Card

title="Total Transactions"

value={totalCount}

/>



<Card

title="Total Amount"

value={money(totalAmount)}

/>



<Card

title="Vendor Earnings"

value={
money(
summary.find(
x=>x.type==="VENDOR_EARNING"
)?._sum?.amount
)
}

/>



<Card

title="Commission"

value={
money(
summary.find(
x=>x.type==="COMMISSION"
)?._sum?.amount
)
}

/>



</div>









<div className="rounded-2xl border border-slate-700 bg-slate-800 p-5">



<h2 className="text-xl font-semibold text-white mb-4">

Transaction History

</h2>




<div className="overflow-x-auto">


<table className="min-w-[1100px] w-full text-left text-sm">


<thead className="border-b border-slate-700 text-slate-300">


<tr>

<th className="py-3">
Date
</th>

<th>
Type
</th>

<th>
Amount
</th>

<th>
Vendor
</th>

<th>
Reference ID
</th>

<th>
Status
</th>

<th>
Description
</th>


</tr>


</thead>




<tbody>


{
transactions.map(
(item,index)=>(


<tr

key={index}

className="border-b border-slate-700 text-white"

>


<td className="py-3 text-slate-400">

{
new Date(
item.date
).toLocaleDateString()
}

</td>




<td>

<Badge
value={item.type}
/>

</td>




<td className="font-bold text-green-400">

{money(item.amount)}

</td>





<td>

{item.vendor || "-"}

</td>




<td className="text-xs text-slate-400">

{item.referenceId || "-"}

</td>




<td>

<StatusBadge
value={item.status}
/>

</td>





<td className="max-w-xs text-slate-400">

{item.description}

</td>



</tr>


)
)

}



</tbody>



</table>


</div>









<div className="mt-5 flex justify-between">


<p className="text-sm text-slate-400">

Page {pagination.page} of {pagination.totalPages}

</p>



<div className="flex gap-2">


<button

disabled={
pagination.page<=1
}

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