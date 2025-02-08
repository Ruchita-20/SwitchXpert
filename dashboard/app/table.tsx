"use client";
import { useState, useEffect } from 'react';
import { db } from './firebase'; // Make sure Firebase is initialized
import { doc, getDoc } from 'firebase/firestore';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function TableDemo() {
  const [applianceData, setApplianceData] = useState({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, 'appliances', 'appliances');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log("Fetched data:", docSnap.data()); // Debugging
          setApplianceData(docSnap.data()); // Store key-value pairs
        } else {
          setError('No data available');
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError('Error fetching data');
      } 
    };

    fetchData();
  }, []);

  const totalUsage = Object.values(applianceData).reduce(
    (sum, value) => sum + value,
    0
  );

  if (error) return <div>{error}</div>;
  const currentDate = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className='rounded-lg shadow-lg'>
     <Table>
     <TableCaption>
       <div className="flex items-center justify-center">
         <span className="text-sm text-center">Readings till {currentDate}</span>
       </div>
     </TableCaption>
     <TableHeader>
       <TableRow>
         <TableHead className="w-[100px]">Appliance</TableHead>
         <TableHead className="text-right">Usage</TableHead>
       </TableRow>
     </TableHeader>
     <TableBody>
     {Object.entries(applianceData).map(([key, value]) => (
         <TableRow key={key}>
           <TableCell className="font-medium">{key}</TableCell>
           <TableCell className="text-right">{value}</TableCell>
         </TableRow>
       ))}
     </TableBody>
     <TableFooter>
       <TableRow>
         <TableCell>Total</TableCell>
         <TableCell className="text-right">₹ {totalUsage}</TableCell>
       </TableRow>
     </TableFooter>
   </Table>
   </div>
  );
}
