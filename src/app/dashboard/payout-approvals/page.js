"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle,
  XCircle,
  CreditCard,
  RefreshCcw,
  Loader2,
  Wallet,
} from "lucide-react";

import { payoutService } from "@/services/payout.service";


const money = (value) =>
  `৳${Number(value || 0).toLocaleString("en-BD")}`;


function StatusBadge({ status }) {
  const colors = {
    PENDING:
      "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    APPROVED:
      "bg-blue-500/10 text-blue-400 border-blue-500/20",
    PAID:
      "bg-green-500/10 text-green-400 border-green-500/20",
    REJECTED:
      "bg-red-500/10 text-red-400 border-red-500/20",
  };


  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-bold ${
        colors[status] || ""
      }`}
    >
      {status}
    </span>
  );
}


export default function PayoutApprovalsPage() {

  const [summary, setSummary] = useState(null);
  const [payouts, setPayouts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");



  const loadData = async () => {

    try {

      setLoading(true);


      const [
        summaryResponse,
        payoutResponse
      ] = await Promise.all([

        payoutService.getAdminSummary(),

        payoutService.getAllPayouts({
          status:"ALL"
        })

      ]);


      setSummary(
        summaryResponse?.summary || null
      );


      setPayouts(
        payoutResponse?.payouts || []
      );


    } catch(error){

      console.log(
        "Finance load error",
        error
      );

    } finally {

      setLoading(false);

    }

  };



  useEffect(()=>{

    loadData();

  },[]);




  const approve = async(id)=>{

    try{

      setActionLoading(id);

      await payoutService.approvePayout(id,{
        adminNote:"Approved by admin"
      });


      await loadData();


    }catch(error){

      console.log(error);

    }finally{

      setActionLoading("");

    }

  };




  const reject = async(id)=>{


    const reason =
      window.prompt(
        "Enter rejection reason"
      );


    if(!reason) return;


    try{

      setActionLoading(id);


      await payoutService.rejectPayout(id,{
        rejectionReason:reason,
        adminNote:"Rejected by admin"
      });


      await loadData();


    }catch(error){

      console.log(error);

    }finally{

      setActionLoading("");

    }

  };




  const markPaid = async(id)=>{


    const transactionId =
      window.prompt(
        "Enter transaction ID"
      );


    if(!transactionId) return;



    try{


      setActionLoading(id);



      await payoutService.markPayoutPaid(
        id,
        {
          transactionId
        }
      );


      await loadData();


    }catch(error){

      console.log(error);


    }finally{

      setActionLoading("");

    }


  };





  if(loading){

    return (

      <div className="flex h-96 items-center justify-center">

        <Loader2
          className="animate-spin text-blue-500"
          size={30}
        />

      </div>

    );

  }




  return (

    <div className="space-y-6">


      {/* Header */}

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-2xl font-bold text-white">
            Payout Approvals
          </h1>

          <p className="text-sm text-slate-400">
            Manage vendor withdrawal requests
          </p>

        </div>


        <button

          onClick={loadData}

          className="flex gap-2 items-center rounded-lg bg-slate-700 px-4 py-2 text-white"

        >

          <RefreshCcw size={17}/>

          Refresh

        </button>


      </div>




      {/* Cards */}


      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">


        <div className="rounded-xl bg-[#1E293B] p-5">

          <Wallet className="text-blue-400"/>

          <p className="text-slate-400 mt-3">
            Vendor Available
          </p>

          <h2 className="text-2xl text-white font-bold">

            {money(
              summary?.totalVendorAvailableBalance
            )}

          </h2>

        </div>




        <div className="rounded-xl bg-[#1E293B] p-5">

          <CreditCard className="text-yellow-400"/>

          <p className="text-slate-400 mt-3">
            Pending Payout
          </p>

          <h2 className="text-2xl text-white font-bold">

            {money(
              summary?.pendingPayout?.amount
            )}

          </h2>

        </div>




        <div className="rounded-xl bg-[#1E293B] p-5">

          <CheckCircle className="text-green-400"/>

          <p className="text-slate-400 mt-3">
            Paid Payout
          </p>

          <h2 className="text-2xl text-white font-bold">

            {money(
              summary?.paidPayout?.amount
            )}

          </h2>

        </div>




        <div className="rounded-xl bg-[#1E293B] p-5">

          <CreditCard className="text-purple-400"/>

          <p className="text-slate-400 mt-3">
            Platform Commission
          </p>

          <h2 className="text-2xl text-white font-bold">

            {money(
              summary?.totalCommission
            )}

          </h2>

        </div>



      </div>





      {/* Table */}


      <div className="rounded-xl bg-[#1E293B] p-5 overflow-x-auto">


        <table className="w-full min-w-[1000px]">


          <thead>

            <tr className="border-b border-white/10 text-slate-400">

              <th className="p-3 text-left">
                Vendor
              </th>

              <th className="p-3">
                Amount
              </th>


              <th className="p-3">
                Payment
              </th>


              <th className="p-3">
                Account
              </th>


              <th className="p-3">
                Status
              </th>


              <th className="p-3">
                Action
              </th>


            </tr>

          </thead>



          <tbody>


          {payouts.map((item)=>(


            <tr
              key={item.id}
              className="border-b border-white/10 text-white"
            >


              <td className="p-3">

                <p className="font-bold">
                  {item.vendor?.shopName}
                </p>

                <p className="text-xs text-slate-400">
                  {item.vendor?.user?.email}
                </p>

              </td>


              <td className="p-3 font-bold text-blue-400">

                {money(item.amount)}

              </td>


              <td className="p-3">

                {item.paymentMethod}

              </td>



              <td className="p-3">

                {item.accountNumber}

              </td>



              <td className="p-3">

                <StatusBadge
                  status={item.status}
                />

              </td>



              <td className="p-3">


              <div className="flex gap-2">


              {item.status==="PENDING" && (

              <>

              <button

              disabled={actionLoading===item.id}

              onClick={()=>approve(item.id)}

              className="rounded-lg bg-green-600 px-3 py-2 text-xs"

              >

              Approve

              </button>



              <button

              onClick={()=>reject(item.id)}

              className="rounded-lg bg-red-600 px-3 py-2 text-xs"

              >

              Reject

              </button>


              </>

              )}




              {item.status==="APPROVED" && (

              <button

              onClick={()=>markPaid(item.id)}

              className="rounded-lg bg-blue-600 px-3 py-2 text-xs"

              >

              Mark Paid

              </button>

              )}



              </div>


              </td>



            </tr>


          ))}



          </tbody>



        </table>



      </div>


    </div>

  );

}