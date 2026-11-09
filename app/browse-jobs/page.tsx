import React from "react"

const BrowseJob = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
    const search = await searchParams;
    console.log("Search Params", search);

  return <div>Browse Job</div>
}

export default BrowseJob
