/*****************************************************
 *                  Junction 2018
 * 
 * Project: Embrace
*****************************************************/

using System.Collections;
using System.Collections.Generic;
using UnityEngine.SceneManagement;
using UnityEngine;


public class RoomFearController : MonoBehaviour {

    private Renderer _renderer;
    private GameState state_map = new GameState();

    private string _url = "http://18.203.88.206/exchange_data";

    private float MIN_DELTA = 0.0f;
    private float MAX_DELTA = 3.0f;
    private float initial_z;

    void Start () {

        _renderer = gameObject.GetComponent<Renderer>();
        // Called when update frames
        Vector3 spherePosition = _renderer.transform.position;
        // Get initial Z position to calculate displacements
        initial_z = spherePosition.z;

        InvokeRepeating("RunUpdateRoomState", 0.6f, 0.6f);
    }

    void RunUpdateRoomState(){
        StartCoroutine(UpdateRoomState());
    }

    IEnumerator UpdateRoomState()
    {
        Camera cam = Camera.current;
        if(cam){
            Vector3 c = cam.transform.position;
            string param = "?x=" + c.x + "&y=" + c.y + "&z=" + c.z;
            string q = _url + param;
            using (WWW www = new WWW(q))
            {
                yield return www;
                if (string.IsNullOrEmpty(www.error))
                {
                    state_map = JsonUtility.FromJson<GameState>(www.text);
                }
            }
        }
    }

    // Update is called once per frame
    void Update () {
        _renderer = gameObject.GetComponent<Renderer>();
        // Called when update frames
        Vector3 spherePosition = _renderer.transform.position;
        // Debug.Log(">>> Exposure: " + state_map.exposure);
        float exposure = (float)state_map.exposure;
        float delta = (MAX_DELTA - MIN_DELTA) * exposure / 100.0f;
        // Limit max distance
        if (delta > MAX_DELTA)
            delta = MAX_DELTA;
        // Limit min distance
        if (delta < MIN_DELTA)
            delta = MIN_DELTA;

        float sig = (initial_z > 0) ? - 1.0f : 1.0f;
        spherePosition.z = initial_z + sig * delta;
        // Transform position 
        _renderer.transform.position = spherePosition;
    }
}
