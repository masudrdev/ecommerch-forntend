import api from "@/lib/axios";


export const financeService = {


    getVendorEarnings: async ({
        page = 1,
        limit = 20,
    } = {}) => {

        const res = await api.get(
            "/finance/vendor-earnings",
            {
                params: {
                    page,
                    limit,
                },
            }
        );

        return res.data;

    },
    getRevenue: async ({
        page = 1,
        limit = 20,
    } = {}) => {


        const res = await api.get(
            "/finance/revenue",
            {
                params: {
                    page,
                    limit,
                },
            }
        );


        return res.data;

    },
    getCommission: async ({
        page = 1,
        limit = 20,
    } = {}) => {


        const res = await api.get(
            "/finance/commission",
            {
                params: {
                    page,
                    limit,
                },
            }
        );


        return res.data;


    },
    getPayoutReports: async ({
        page = 1,
        limit = 20,
    } = {}) => {


        const res = await api.get(
            "/finance/payout-reports",
            {
                params: {
                    page,
                    limit,
                },
            }
        );


        return res.data;


    },
    getTransactions: async ({
        page = 1,
        limit = 20,
        type = "",
    } = {}) => {

        const res = await api.get(
            "/finance/transactions",
            {
                params: {
                    page,
                    limit,
                    ...(type && { type }),
                },
            }
        );

        return res.data;

    },
};