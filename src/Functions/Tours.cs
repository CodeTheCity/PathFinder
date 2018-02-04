using Newtonsoft.Json;
using System.Net;
using System.Net.Http;
using Functions.Entities;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Host;
using System.Text;
using System.Linq;
using System.Collections.Generic;

namespace Functions {
    public static class Tours {
        [FunctionName("GetAllTours")]
        public static HttpResponseMessage GetAllTours(
            [HttpTrigger(AuthorizationLevel.Anonymous, "GET", Route = "Tours/")]HttpRequestMessage req,
            TraceWriter log) {

            using (DataContext context = new DataContext()) {
                var tours = context.Tours
                    .Select(row => new {
                        row.TourId,
                        row.Name,
                    })
                    .ToList();

                string json = JsonConvert.SerializeObject(tours);

                return new HttpResponseMessage(HttpStatusCode.OK) {
                    Content = new StringContent(json, Encoding.UTF8, "application/json")
                };
            }
        }

        [FunctionName("GetTour")]
        public static HttpResponseMessage GetTour(
            [HttpTrigger(AuthorizationLevel.Anonymous, "GET", Route = "Tours/{tourId}")]HttpRequestMessage req,
            int tourId,
            TraceWriter log) {

            using (DataContext context = new DataContext()) {
                var tour = context.Tours
                    .Where(row => row.TourId == tourId)
                    .Select(row => new {
                        row.TourId,
                        row.Name,
                    })
                    .SingleOrDefault();

                if (tour == null) {
                    return new HttpResponseMessage(HttpStatusCode.NotFound);
                }

                string json = JsonConvert.SerializeObject(tour);

                return new HttpResponseMessage(HttpStatusCode.OK) {
                    Content = new StringContent(json, Encoding.UTF8, "application/json")
                };
            }
        }
    }
}
