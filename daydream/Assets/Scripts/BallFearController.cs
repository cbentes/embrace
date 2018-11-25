/*****************************************************
 *                  Junction 2018
 * 
 * Project: Embrace
*****************************************************/

using System.Collections;
using System.Collections.Generic;
using UnityEngine.SceneManagement;
using UnityEngine;


public class BallFearController : MonoBehaviour {

    private Renderer _renderer;
    private GameState state_map = new GameState();

    private string _url = "http://18.203.88.206/exchange_data";

    private float MIN_Z_DISTANCE = 1.0f;
    private float MAX_Z_DISTANCE = 20.0f;
    private string DEVICE = "D000001";

    void Start () {
        _renderer = gameObject.GetComponent<Renderer>();
        InvokeRepeating("RunUpdateBallState", 0.6f, 0.6f);
    }

    void RunUpdateBallState()
    {
        StartCoroutine(UpdateBallState());
    }

    IEnumerator UpdateBallState(){
        Camera cam = Camera.current;
        if(cam){
            Vector3 c = cam.transform.position;
            string param = "?x=" + c.x + "&y=" + c.y + "&z=" + c.z + "&dev="+ DEVICE;
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

    void TransitionAnimal(GameObject animal, bool value)
    {
        if(animal){
            Renderer r = animal.GetComponent<Renderer>();
            if (r)
            {
                r.enabled = value;
            }
        }
    }

    void Update () {
        // Called when update frames
        Vector3 spherePosition = _renderer.transform.position;
        float exposure = 100.0f - state_map.exposure;
        float range = (MAX_Z_DISTANCE - MIN_Z_DISTANCE) * exposure / 100.0f;
        spherePosition.z = range + MIN_Z_DISTANCE;

        // Limit max distance
        if (spherePosition.z > MAX_Z_DISTANCE)
            spherePosition.z = MAX_Z_DISTANCE;
        // Limit min distance
        if (spherePosition.z < MIN_Z_DISTANCE)
            spherePosition.z = MIN_Z_DISTANCE;

        // Transform position 
        _renderer.transform.position = spherePosition;

        // Update Animal
        GameObject spider = GameObject.FindWithTag("SpiderTag");
        GameObject dog = GameObject.FindWithTag("DogTag");
        GameObject rat = GameObject.FindWithTag("RatTag");

        if (state_map.animal == "spider")
        {
            this.TransitionAnimal(spider, true);
            this.TransitionAnimal(dog, false);
            this.TransitionAnimal(rat, false);
        }
        if (state_map.animal == "dog")
        {
            this.TransitionAnimal(spider, false);
            this.TransitionAnimal(dog, true);
            this.TransitionAnimal(rat, false);
        }
        if (state_map.animal == "rat")
        {
            this.TransitionAnimal(spider, false);
            this.TransitionAnimal(dog, false);
            this.TransitionAnimal(rat, true);
        }
    }
}
