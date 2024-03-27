import Input from "@/components/Parts/Input";
import ReusableInput from "@/components/Parts/ReusableInput";
import { records } from "@prisma/client";
import React, { useState } from "react";

function Admin() {
  const [record, setRecord] = useState<records>({
    authorName: "",
    batchNumber: 0,
    clientName: "",
    dateCreated: new Date(),
    destination: "",
    truckName: "",
    id: "",
    poId: "",
  });

  return (
    <div className="flex h-full w-full items-start justify-start border border-black p-10 text-black">
      <div className="flex flex-col items-center justify-center gap-2">
        <input type="text" className="border border-black" />
        <input type="text" className="border border-black" />
        <input type="text" className="border border-black" />
        <input type="text" className="border border-black" />
        <input type="text" className="border border-black" />
        <Input
          attributes={{
            input: undefined,
            label: {
              defaultValue: "Search Name",
            },
          }}
        />
      </div>
    </div>
  );
}

export default Admin;

/* 
    THIS NEEDED TO IMPLEMENT
    THE API CORRELATION
    - DISPLAY BINS
    - ADD THE SKU
    - CHANGE DYNAMICALLY THE TRUCK CAPACITY
    - MAKE USE OF NEWLT ADDED TRUCK THRESHOLD
    - MAKE A MORE UNDERSTANDABLE RECORDS THAT CORRELATE TO OTHERS

    THIS IS THE PICKING OF PRODUCT INSIDE THE WAREHOUSE TO BE READY IN THE TRUCK

    THE USER MUST GET THE ORDER PAPER TO INPUT THE NECESSARY PRODUCT OF THE CLIENT

    make an API that is more accurate for creating records

    records: {
      ...recordsDetails,
      Location: {
        recordId: ""
        name: "",
        coordinates: {
          longitude: "",
          latitude:  ""
        }
      }
    }
   
     recordsDetails: {[ 
      orderedProducts: {
        [binLocation: {
          binId: 
          skuCode: sku1
          barcode: 123
          quantity: 
        }, 
        binLocation: {
          binId: 
          skuCode: sku2
          barcode: 123
          quantity: 
        }] 
      },
      orderedProducts: {
        binLocation: {
          binId: 
          skuCode: sku3
          barcode: 321
          quantity: 
        }
      }]

    the location can be  self entity

    const total = array.reduce(accumulator, sum => { const total  = {
      totalTest: accumalator + sum
    } }, { totalTest: 0 })

    console.log(total)

    register lots of location to be access by the admin
    







*/
