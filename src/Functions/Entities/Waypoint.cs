using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Functions.Entities
{
    public class Waypoint {
        public int WaypointId { get; internal set; }
        public string Name { get; internal set; }
        public double Latitude { get; internal set; }
        public double Longitude { get; internal set; }
        public string Description { get; internal set; }
        public bool HasFee { get; internal set; }
        public bool IsAccessible { get; internal set; }
        public bool HasParking { get; internal set; }
        public string Url { get; internal set; }
        public string TelephoneNumber { get; internal set; }
        public string Category { get; internal set; }
    }
}
