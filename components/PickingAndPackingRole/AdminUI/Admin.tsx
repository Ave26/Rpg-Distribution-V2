import useLocations from "@/hooks/useLocations";
import AdminRecordForm from "./AdminRecordForm";
import useTrucks from "@/hooks/useTrucks";
import InventoryView from "./InventoryView";

export default function Admin() {
  return (
    <div className="flex h-full w-full flex-wrap items-center justify-center  gap-2 text-black transition-all md:flex-nowrap md:items-start md:justify-start">
      <AdminRecordForm />
      <InventoryView />
    </div>
  );
}

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

      batchNumber: 0,
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

      clientName  
      dateCreated     
      batchNumber       
      POO                  
      locationName         
      authorName           
      truckName          

      orderedProducts: {
        recordId
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
    




         <select name="" id="" className={inputStyle}>
          {Array.isArray(locations) ? (
            locations.map((location) => {
              return <option key={location.id}>{location.name}</option>;
            })
          ) : (
            <option>
              <Loading />
            </option>
          )}
        </select> */

/* <select
          name={key}
          id={key}
          value={record[key as keyof TRecords]}
          onChange={handleChange}
          className="border-blue-gray-200  text-blue-gray-700 placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 disabled:bg-blue-gray-50 peer h-full w-full appearance-none rounded-[7px] border bg-transparent px-3 py-2 font-sans text-sm font-normal outline outline-0 transition-all focus:border-2 focus:border-sky-400"
        >
          {truckStatus.map((statusOption) => (
            <option key={statusOption} value={statusOption}>
              {statusOption}
            </option>
          ))
        </select> 


 {key !== "status" && key !== "id" && (
              <TMInput
                attributes={{
                  input: {
                    name: key,
                    id: key,
                    type:
                      typeof form[key as keyof TForm] === "number"
                        ? "number"
                        : "text",
                    min:
                      typeof form[key as keyof TForm] === "number"
                        ? 0
                        : undefined,
                    value: form[key as keyof TForm],
                    onChange: handleChange,
                  },
                  label: {
                    children: key,
                    htmlFor: key,
                  },
                }}
              />
            )}
*/
