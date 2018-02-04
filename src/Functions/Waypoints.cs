using System.Net;
using System.Net.Http;
using System.Text;
using Functions.Entities;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Host;
using Newtonsoft.Json;
using System.Linq;

namespace Functions {
    public static class Waypoints
    {
        [FunctionName("GetWaypoints")]
        public static HttpResponseMessage GetWaypoints(
            [HttpTrigger(AuthorizationLevel.Anonymous, "GET", "post", Route = "Waypoints/")]HttpRequestMessage req,
            TraceWriter log) {

            using (DataContext context = new DataContext()) {
                var waypoints = context.Waypoints
                    .Select(row => new {
                        row.WaypointId,
                        row.Name,
                        row.Category,
                        row.Description,
                        row.HasFee,
                        row.HasParking,
                        row.IsAccessible,
                        row.Latitude,
                        row.Longitude,
                        row.TelephoneNumber,
                        row.TourId,
                        row.Url,
                    })
                    .ToList();

                string json = JsonConvert.SerializeObject(waypoints);

                return new HttpResponseMessage(HttpStatusCode.OK) {
                    Content = new StringContent(json, Encoding.UTF8, "application/json")
                };
            }
        }

        [FunctionName("GetWaypointsByTour")]
        public static HttpResponseMessage GetWaypointsByTour(
            [HttpTrigger(AuthorizationLevel.Anonymous, "GET", "post", Route = "Waypoints/tour/{tourId}")]HttpRequestMessage req,
            int tourId,
            TraceWriter log) {

            using (DataContext context = new DataContext()) {
                bool tourExists = context.Tours.Any(row => row.TourId == tourId);

                if(!tourExists) {
                    return new HttpResponseMessage(HttpStatusCode.NotFound);
                }

                var waypoints = context.Waypoints
                    .Where(row => row.TourId == tourId)
                    .Select(row => new {
                        row.WaypointId,
                        row.Name,
                        row.Category,
                        row.Description,
                        row.HasFee,
                        row.HasParking,
                        row.IsAccessible,
                        row.Latitude,
                        row.Longitude,
                        row.TelephoneNumber,
                        row.TourId,
                        row.Url,
                    })
                    .ToList();

                string json = JsonConvert.SerializeObject(waypoints);

                return new HttpResponseMessage(HttpStatusCode.OK) {
                    Content = new StringContent(json, Encoding.UTF8, "application/json")
                };
            }
        }
    }
}
