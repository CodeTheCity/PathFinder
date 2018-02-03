using Newtonsoft.Json;
using System.Net;
using System.Net.Http;
using Functions.Entities;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Host;
using System.Text;

namespace Functions {
    public static class Tours {
        [FunctionName("GetAllTours")]
        public static HttpResponseMessage GetAllTours(
            [HttpTrigger(AuthorizationLevel.Anonymous, "GET", Route = "Tours/")]HttpRequestMessage req,
            TraceWriter log) {

            string json = JsonConvert.SerializeObject(new[] {
                new Tour {
                    TourId = 0,
                    Name = "Aberdeenshire Castle Trail",
                },
                new Tour{
                    TourId = 1,
                    Name = "Whisky Distillery Trail",
                },
            });

            return new HttpResponseMessage(HttpStatusCode.OK) {
                Content = new StringContent(json, Encoding.UTF8, "application/json")
            };
        }

        [FunctionName("GetTour")]
        public static HttpResponseMessage GetTour(
            [HttpTrigger(AuthorizationLevel.Anonymous, "GET", Route = "Tours/name/{name}")]HttpRequestMessage req,
            string name,
            TraceWriter log) {

            // Fetching the name from the path parameter in the request URL
            return req.CreateResponse(HttpStatusCode.OK, "Hello " + name);
        }
    }
}
