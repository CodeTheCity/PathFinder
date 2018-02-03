using System.Net;
using System.Net.Http;
using System.Text;
using Functions.Entities;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Host;
using Newtonsoft.Json;

namespace Functions {
    public static class Waypoints
    {
        [FunctionName("GetWaypoints")]
        public static HttpResponseMessage GetWaypoints(
            [HttpTrigger(AuthorizationLevel.Anonymous, "GET", "post", Route = "Waypoints/")]HttpRequestMessage req,
            TraceWriter log)
            {

            string json = JsonConvert.SerializeObject(new[] {
                new Waypoint {
                    WaypointId = 1,
                    TourId = 0,
                    Name = "Slains Castle",
                    Latitude = 57.4153798,
                    Longitude = -1.9023549,
                    Description = string.Empty,
                    HasFee = false,
                    IsAccessible = false,
                    HasParking = true,
                    Url = string.Empty,
                    TelephoneNumber = string.Empty,
                    Category = "Castles",
                },
            });

            return new HttpResponseMessage(HttpStatusCode.OK) {
                Content = new StringContent(json, Encoding.UTF8, "application/json")
            };
        }
    }
}
