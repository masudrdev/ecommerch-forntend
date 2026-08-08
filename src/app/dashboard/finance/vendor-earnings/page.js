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
    COMPLETED:
      "bg-green-500/10 text-green-400 border-green-500/30",

    PENDING:
      "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",

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



export default function VendorEarningsPage() {


  const [summary,setSummary] = useState({});

  const [vendors,setVendors] = useState([]);

  const [items,setItems] = useState([]);


  const [pagination,setPagination] = useState({
    page:1,
    limit:20,
    total:0,
    totalPages:1,
  });



  const [pageLoading,setPageLoading] = useState(true);

  const [tableLoading,setTableLoading] = useState(false);





  const fetchData = async (
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
        await financeService.getVendorEarnings({
          page,
          limit:20,
        });



      setSummary(
        res?.summary || {}
      );


      setVendors(
        res?.vendors || []
      );


      setItems(
        res?.items || []
      );


      setPagination(
        res?.pagination || {}
      );



    }catch(error){

      console.error(
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

        Loading vendor earnings...

      </div>

    );

  }







return (

<div className="space-y-6">





<div className="flex items-center justify-between">


<div>

<h1 className="text-3xl font-bold text-white">
Vendor Earnings
</h1>


<p className="text-sm text-slate-400">
View vendor sales, commission and earnings.
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
?"animate-spin"
:""
}

/>


Refresh


</button>



</div>








{/* Summary Cards */}


<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">


<Card
title="Total Sales"
value={money(summary.totalSales)}
/>


<Card
title="Vendor Earnings"
value={money(summary.totalVendorEarning)}
/>


<Card
title="Platform Commission"
value={money(summary.totalCommission)}
/>


<Card
title="Completed Orders"
value={summary.totalOrders}
/>


</div>







{/* Vendor Summary */}



<div className="rounded-2xl border border-slate-700 bg-slate-800 p-4 md:p-5">


<h2 className="mb-4 text-xl font-semibold text-white">
Vendor Summary
</h2>



<div className="w-full overflow-x-auto">

<table className="min-w-[1000px] w-full text-left text-sm">


<thead className="border-b border-slate-700 text-slate-300">


<tr>

<th className="py-3">
Vendor
</th>

<th>
Orders
</th>

<th>
Sales
</th>

<th>
Commission
</th>

<th>
Earning
</th>


</tr>


</thead>



<tbody>


{vendors.map((vendor)=>(


<tr

key={vendor.vendorId}

className="border-b border-slate-700"

>


<td className="py-3 text-white font-semibold">
{vendor.vendorName}
</td>


<td>
{vendor.totalOrders}
</td>


<td>
{money(vendor.totalSales)}
</td>


<td className="text-blue-400">
{money(vendor.commission)}
</td>


<td className="text-green-400">
{money(vendor.vendorEarning)}
</td>


</tr>


))}


</tbody>


</table>


</div>


</div>









{/* Earnings Details */}



<div className="rounded-2xl border border-slate-700 bg-slate-800 p-4 md:p-5">



<div className="mb-4 flex items-center justify-between">


<h2 className="text-xl font-semibold text-white">
Earnings Details
</h2>


{

tableLoading &&

<span className="text-sm text-blue-400">
Updating...
</span>

}


</div>






<div className="w-full overflow-x-auto">


<table className="min-w-[1000px] w-full text-left text-sm">


<thead className="border-b border-slate-700 text-slate-300">


<tr>

<th className="py-3">
Order ID
</th>

<th>
Vendor
</th>

<th>
Product
</th>

<th>
Sale Price
</th>

<th>
Commission
</th>

<th>
Vendor Earning
</th>

<th>
Status
</th>

<th>
Date
</th>


</tr>


</thead>



<tbody>


{items.map((item,index)=>(


<tr

key={index}

className="border-b border-slate-700"

>


<td className="py-3 text-white">
{item.orderId}
</td>


<td>
{item.vendor}
</td>


<td>
{item.product}
</td>


<td>
{money(item.salePrice)}
</td>


<td className="text-blue-400">
{money(item.commission)}
</td>


<td className="text-green-400">
{money(item.vendorEarning)}
</td>


<td>
<StatusBadge status={item.status}/>
</td>


<td className="text-slate-400">
{new Date(item.date).toLocaleDateString()}
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