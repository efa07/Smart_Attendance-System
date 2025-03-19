import AttendanceTrend from "@/components/charts/epchart"


export default function chart() {
  return (
      <div className=" flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Attendance Reports</h1> 
                <AttendanceTrend  />

    </div>
  )
}
