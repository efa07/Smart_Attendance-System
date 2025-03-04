import AttendanceTrend from "@/components/charts/epchart"
export default function chart() {
  return (
    <div className="w-md h-96">
        <AttendanceTrend userId={13} />
    </div>
  )
}
