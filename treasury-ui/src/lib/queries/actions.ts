import { gql } from "graphql-request";

export const ACTIONS_QUERY = gql`
    query Actions(
        $limit: Int!
        $offset: Int!
        $where: ActionWhereInput
    ) {
        actions(
        limit: $limit
        offset: $offset
        where: $where
        ) {
        id
        network,
        timestamp
        actionType
        value
        status
        txHash
        params
        block
        actionId
        }
    }
`