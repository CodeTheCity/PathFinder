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

            string json = "[{\"Name\":\"Kildrummy Castle\",\"Description\":\"Discover the imposing 13th century stronghold of the Earls of Mar.\",\"Category\":\"Castles\",\"Latitude\":57.2354,\"Longitude\":-2.8999,\"Url\":\"https://www.historicenvironment.scot/visit-a-place/places/kildrummy-castle/\",\"HasFee\":\"3\",\"TelephoneNumber\":null,\"IsAccessible\":true,\"HasParking\":false},{\"Name\":\"Huntly Castle\",\"Description\":\"A magnificent ruin of a castle from the 12th-century motte to the palace block erected in the 16th and 17th centuries by the Gordon family.\",\"Category\":\"Castles\",\"Latitude\":57.4554,\"Longitude\":-2.78045,\"Url\":\"https://www.historicenvironment.scot/visit-a-place/places/huntly-castle/\",\"HasFee\":\"3.60\",\"TelephoneNumber\":null,\"IsAccessible\":true,\"HasParking\":false},{\"Name\":\"Tolquhon Castle\",\"Description\":\"Explore the impressive ruins of this fairytale castle set in the stunning Grampian countryside.\",\"Category\":\"Castles\",\"Latitude\":57.3518,\"Longitude\":-2.2133,\"Url\":\"https://www.historicenvironment.scot/visit-a-place/places/tolquhon-castle/\",\"HasFee\":\"3\",\"TelephoneNumber\":null,\"IsAccessible\":true,\"HasParking\":true},{\"Name\":\"Fyvie Castle, Garden & Estate\",\"Description\":\"A magnificent fortress in the heart of Aberdeenshire, Fyvie Castle’s 800-year history is rich in legends, folklore and even ghost stories. Discover the amazing collection of antiquities, armour and lavish oil paintings. Stroll around the picturesque loch, or visit the restored glass-roofed racquets court and ice house.\",\"Category\":\"Castles\",\"Latitude\":57.4483,\"Longitude\":-2.3951,\"Url\":\"http://www.nts.org.uk/Property/Fyvie-Castle/\",\"HasFee\":null,\"TelephoneNumber\":null,\"IsAccessible\":true,\"HasParking\":false},{\"Name\":\"Craigievar Castle\",\"Description\":\"If fairytales were real, all castles would look like Craigievar. Discover the beautiful property said to be the inspiration for Disney’s Cinderella Castle. Admire an impressive collection of artefacts and art – including Raeburn portraits, armour and weapons – or enjoy a peaceful stroll around the garden and estate.\",\"Category\":\"Castles\",\"Latitude\":57.17439,\"Longitude\":-2.7193,\"Url\":\"http://www.nts.org.uk/Property/Craigievar-Castle/\",\"HasFee\":null,\"TelephoneNumber\":null,\"IsAccessible\":true,\"HasParking\":true},{\"Name\":\"Delgatie Castle Estate Trust\",\"Description\":\"Dating from about 1050, Delgatie is a uniquely Scottish Castle. It is the home of the late Captain and Mrs Hay of Delgatie, and is the Clan Hay Centre.\",\"Category\":\"Castles\",\"Latitude\":57.54817,\"Longitude\":-2.41282,\"Url\":\"http://www.delgatiecastle.com\",\"HasFee\":null,\"TelephoneNumber\":null,\"IsAccessible\":false,\"HasParking\":false}]";

            return new HttpResponseMessage(HttpStatusCode.OK) {
                Content = new StringContent(json, Encoding.UTF8, "application/json")
            };
        }
    }
}
